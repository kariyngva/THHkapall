#coding=UTF-8
import unittest
from Deck import *

class testKapallFunctions(unittest.TestCase):
    def test_Card(self):
        spil1= Card("diamonds","ace",1)
        spil2= Card("hearts","three",3)
        spil3= Card("spades","five",3)

        self.assertEqual(spil1.rank,"ace")
        self.assertEqual(spil1.suit,"diamonds")
        self.assertEqual(spil1.value,1)
        self.assertNotEqual(spil1.value,spil2.value)
        self.assertNotEqual(spil2.suit,spil3.suit)
        self.assertNotEqual(spil1.suit,spil3.suit)

    def test_Deck(self):
        stokkur1=Deck()
        stokkur2=Deck()
        stokkur3=Deck()
        spil1=stokkur1.draw()
        spil2=stokkur1.draw()
        rank=spil1.rank
        suit=spil2.suit

        self.assertEqual(stokkur3.count(),52)
        self.assertEqual(stokkur1.count(),50)
        self.assertTrue(stokkur3.count()>stokkur1.count())
        self.assertNotEqual(stokkur1,stokkur3)
        self.assertNotEqual(spil1,spil2)
        self.assertNotEqual(stokkur3.draw(),stokkur3.draw())
        self.assertEqual(spil1.rank, rank)
        self.assertEqual(spil2.suit, suit)
        self.assertNotEqual(stokkur1, stokkur1.shuffle())


if __name__ == '__main__':
    unittest.main(verbosity=2, exit=False)
