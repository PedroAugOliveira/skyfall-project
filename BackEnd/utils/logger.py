# logger.py
import pyfiglet
from pyfiglet import Figlet
from clint.textui import colored

class Logger(object):

    def __init__(self):
        self.LB = '\033[0;36;40m'
        self.W = '\033[0m'

    def banner(self):
        custom_fig = Figlet(font='Slant', justify="center")
        r = custom_fig.renderText('SkyFall')
        banner = colored.magenta(r)
        print(banner)
        print('%sAuthor: Pedro Augusto de Oliveira & Murilo Storti Irani%s'.center(80) % (self.LB, self.W))
        print('%sVersion: 0.1.0%s'.center(80) % (self.LB, self.W))
        print('\n')
