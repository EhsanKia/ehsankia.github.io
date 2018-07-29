import numpy as np
import random

U, L, R, D = range(4)

POWER = [
    [ 3, 2, 2, 3],
    [ 4, 1, 1, 4],
    [ 2, 3, 3, 2],
    [ 6, 1, 1, 2],
    [ 4, 3, 4, 4],
    [ 7, 3, 3, 2],
    [ 4, 3, 5, 3],
    [ 1, 5, 5, 4],
    [ 4, 4, 4, 3],
    [ 5, 5, 5, 5],
    [ 6, 5, 5, 4],
    [ 4, 4, 4, 8],
    [ 3, 6, 6, 5],
    [ 3, 7, 5, 5],
    [ 4, 5, 8, 3],
    [ 7, 6, 6, 6],
    [ 5, 5, 7, 8],
    [ 6, 6, 6, 7],
    [ 5,10, 5, 5],
    [ 6, 9, 5, 5],
    [ 7, 7,10, 6],
    [10, 5, 5,10],
    [ 9, 9, 9, 8]
]


class MatchController:
    def __init__(self, ai1, ai2):
        self.AIs = [ai1, ai2]

    def runGame(self, random_start=True):
        board = np.ones((3,3), dtype=np.int8) * -1

        cards = []
        cards.append(random.sample(range(23), 5))
        cards.append(random.sample(range(23), 5))

        turn = random_start and random.random() < 0.5
        start = not turn

        for i in range(9):
            card, pos = self.AIs[turn].compute(board, cards[turn], turn)
            board[tuple(pos)] = card + (turn << 5)
            cards[turn].remove(card)
            self._handle_flips(board, card, pos, turn)
            turn = not turn

        return cmp(np.count_nonzero(board>>5) + turn, 5)

    def _handle_flips(self, board, card, pos, color):
        x, y = pos
        card_power = POWER[card]

        if y < 2:
            opp = board[x,y+1]
            if opp>>5 == (not color) and card_power[U] > POWER[opp&31][D]:
                board[x,y+1] ^= 32

        if x > 0:
            opp = board[x-1,y]
            if opp>>5 == (not color) and card_power[L] > POWER[opp&31][R]:
                board[x-1,y] ^= 32

        if x < 2:
            opp = board[x+1,y]
            if opp>>5 == (not color) and card_power[R] > POWER[opp&31][L]:
                board[x+1,y] ^= 32

        if y > 0:
            opp = board[x,y-1]
            if opp>>5 == (not color) and card_power[D] > POWER[opp&31][U]:
                board[x,y-1] ^= 32

    def runTournament(self, n, random_start=True):
        score = 0
        for i in xrange(n):
            score += self.runGame(random_start)

        ratio = 0.5 + float(score)/(2*n)

        data = {
            "ai1": self.AIs[0].__class__.__name__,
            "ratio1": (1 - ratio) * 100,
            "ai2": self.AIs[1].__class__.__name__,
            "ratio2": ratio * 100
        }

        print "{ai1:25}: {ratio1}%\n{ai2:25}: {ratio2}%".format(**data)


class RandomCardRandomPos:
    def compute(self, board, cards, color):
        card = random.choice(cards)

        open_pos = np.where(board==-1)
        random_ind = np.random.randint(open_pos[0].shape[0])
        pos = open_pos[0][random_ind], open_pos[1][random_ind]
        return card, pos

class WeakestFirstRandomPos:
    def compute(self, board, cards, color):
        card = min(cards)

        open_pos = np.where(board==-1)
        random_ind = np.random.randint(open_pos[0].shape[0])
        pos = open_pos[0][random_ind], open_pos[1][random_ind]
        return card, pos

class StrongerFirstRandomPos:
    def compute(self, board, cards, color):
        card = max(cards)

        open_pos = np.where(board==-1)
        random_ind = np.random.randint(open_pos[0].shape[0])
        pos = open_pos[0][random_ind], open_pos[1][random_ind]
        return card, pos

class MostFlips:
    def compute(self, board, cards, color):
        open_pos = np.where(board==-1)
        best_c, best_p, best_s = -1, -1, -1

        for p in np.transpose(open_pos):
            for c in cards:
                score = self.count_flips(board, c, p, color)
                if score > best_s:
                    best_s = score
                    best_c = c
                    best_p = p

        return best_c, best_p

    def count_flips(self, board, card, pos, color):
        x, y = pos
        card_power = POWER[card]
        count = 0

        if y < 2:
            opp = board[x,y+1]
            if opp>>5 == (not color) and card_power[U] > POWER[opp&31][D]:
                count += 1

        if x > 0:
            opp = board[x-1,y]
            if opp>>5 == (not color) and card_power[L] > POWER[opp&31][R]:
                count += 1

        if x < 2:
            opp = board[x+1,y]
            if opp>>5 == (not color) and card_power[R] > POWER[opp&31][L]:
                count += 1

        if y > 0:
            opp = board[x,y-1]
            if opp>>5 == (not color) and card_power[D] > POWER[opp&31][U]:
                count += 1

        return count

class MostFlipsSorted:
    def compute(self, board, cards, color):
        open_pos = np.where(board==-1)
        best_c, best_p, best_s = -1, -1, -1

        for p in np.transpose(open_pos):
            for c in sorted(cards):
                score = self.count_flips(board, c, p, color)
                if score > best_s:
                    best_s = score
                    best_c = c
                    best_p = p

        return best_c, best_p

    def count_flips(self, board, card, pos, color):
        x, y = pos
        card_power = POWER[card]
        count = 0

        if y < 2:
            opp = board[x,y+1]
            if opp>>5 == (not color) and card_power[U] > POWER[opp&31][D]:
                count += 1

        if x > 0:
            opp = board[x-1,y]
            if opp>>5 == (not color) and card_power[L] > POWER[opp&31][R]:
                count += 1

        if x < 2:
            opp = board[x+1,y]
            if opp>>5 == (not color) and card_power[R] > POWER[opp&31][L]:
                count += 1

        if y > 0:
            opp = board[x,y-1]
            if opp>>5 == (not color) and card_power[D] > POWER[opp&31][U]:
                count += 1

        return count

class MostFlipsCover:
    def compute(self, board, cards, color):
        open_pos = np.where(board==-1)
        best_c, best_p, best_s = -1, -1, -1

        for p in np.transpose(open_pos):
            for c in sorted(cards):
                score = self.count_flips(board, c, p, color)
                if score > best_s:
                    best_s = score
                    best_c = c
                    best_p = p

        return best_c, best_p

    def count_flips(self, board, card, pos, color):
        x, y = pos
        card_power = POWER[card]
        count = 0

        if y < 2:
            opp = board[x,y+1]
            if opp>>5 == (not color) and card_power[U] > POWER[opp&31][D]:
                count += 1.0/self.count_open(board, (x,y+1))

        if x > 0:
            opp = board[x-1,y]
            if opp>>5 == (not color) and card_power[L] > POWER[opp&31][R]:
                count += 1.0/self.count_open(board, (x-1,y))

        if x < 2:
            opp = board[x+1,y]
            if opp>>5 == (not color) and card_power[R] > POWER[opp&31][L]:
                count += 1.0/self.count_open(board, (x+1,y))

        if y > 0:
            opp = board[x,y-1]
            if opp>>5 == (not color) and card_power[D] > POWER[opp&31][U]:
                count += 1.0/self.count_open(board, (x,y-1))

        return count

    def count_open(self, board, pos):
        x, y = pos
        count = 0

        if y < 2 and board[x,y+1] == -1:
            count += 1

        if x > 0 and board[x-1,y] == -1:
            count += 1

        if x < 2 and board[x+1,y] == -1:
            count += 1

        if y > 0 and board[x,y-1] == -1:
            count += 1

        return count


class MostFlipsCover2:
    def compute(self, board, cards, color):
        open_pos = np.where(board==-1)
        best_c, best_p, best_s = -1, -1, -1

        for p in np.transpose(open_pos):
            for c in sorted(cards):
                score = self.count_flips(board, c, p, color)
                if score > best_s:
                    best_s = score
                    best_c = c
                    best_p = p

        return best_c, best_p

    def count_flips(self, board, card, pos, color):
        x, y = pos
        card_power = POWER[card]
        count = 0

        if y < 2:
            opp = board[x,y+1]
            if opp>>5 == (not color) and card_power[U] > POWER[opp&31][D]:
                count += 1.0/self.count_open(board, (x,y+1))

        if x > 0:
            opp = board[x-1,y]
            if opp>>5 == (not color) and card_power[L] > POWER[opp&31][R]:
                count += 1.0/self.count_open(board, (x-1,y))

        if x < 2:
            opp = board[x+1,y]
            if opp>>5 == (not color) and card_power[R] > POWER[opp&31][L]:
                count += 1.0/self.count_open(board, (x+1,y))

        if y > 0:
            opp = board[x,y-1]
            if opp>>5 == (not color) and card_power[D] > POWER[opp&31][U]:
                count += 1.0/self.count_open(board, (x,y-1))

        return count

    def count_open(self, board, pos):
        x, y = pos
        count = 0

        if y < 2 and board[x,y+1] == -1:
            count += 1

        if x > 0 and board[x-1,y] == -1:
            count += 1

        if x < 2 and board[x+1,y] == -1:
            count += 1

        if y > 0 and board[x,y-1] == -1:
            count += 1

        return count


rr  = RandomCardRandomPos()
wr  = WeakestFirstRandomPos()
sr  = StrongerFirstRandomPos()
mf  = MostFlips()
mfs = MostFlipsSorted()
mfc = MostFlipsCover()
mfc2 = MostFlipsCover2()

m = MatchController(mfc, mfc)
m.runTournament(2000, random_start=False)