#!/usr/bin/python3

import argparse
import random

parser = argparse.ArgumentParser(description='コマンドライン引数で動作を分岐')

parser.add_argument('--on', help='on', action='store_true')
parser.add_argument('--off', help='off', action='store_true')
parser.add_argument('--get', help='get', action='store_true')
parser.add_argument('--wrate', help='withdraw rateの指定(流量 単位)', nargs=2)


args = parser.parse_args()

if args.on:
    print('on is done.')

if args.off:
    print('off is done.')

if args.get:
    print(random.randrange(1, 100, 1))
    print('get is done.')

if args.wrate is not None:
    speed = args.wrate[0]
    unit = args.wrate[1]
    cmd = 'wrate ' + speed + ' ' + unit + '\r\n'

    print(cmd)
    print('wrate is set')
