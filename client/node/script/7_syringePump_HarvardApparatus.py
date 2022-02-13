#!/usr/bin/python3

#コマンドライン引数オプション
import argparse

parser = argparse.ArgumentParser(description = 'コマンドライン引数で動作を分岐')

parser.add_argument('--irate', help='infusion rateの指定(流量 単位)', nargs=2)
#--irate a b => args.irate = ['a','b']
parser.add_argument('--wrate', help='withdraw rateの指定(流量 単位)', nargs=2)
parser.add_argument('--irun', help='infusion run', action='store_true')
parser.add_argument('--wrun', help='withdraw run', action='store_true')
parser.add_argument('--off', help='stop the pump action', action='store_true')

parser.add_argument('--test', help='aaaa', nargs=2)

args = parser.parse_args()

#ここから実行用コード
import serial
import time

#sirial通信開通
ser = serial.Serial()
ser.port = '/dev/ttyACM0'
ser.baudrate = 115200
ser.bytesize = serial.EIGHTBITS
ser.stopbits = serial.STOPBITS_ONE
ser.parity = serial.PARITY_NONE
ser.xonxoff = False
ser.rtscts = False
ser.dsrdtr = False

ser.open()

if args.irate is not None:
    speed = args.irate[0]
    unit = args.irate[1]
    cmd = 'irate ' + speed + ' ' + unit + '\r\n'
    # print(ser.isOpen())

    ser.write(cmd.encode())
    # print(cmd.encode())
    #ser.write(B'ver')
    #ser.flush()

    time.sleep(0.1)
    res = ser.read_all()
    print(res.decode())

if args.wrate is not None:
    speed = args.wrate[0]
    unit = args.wrate[1]
    cmd = 'wrate ' + speed + ' ' + unit + '\r\n'
    ser.write(cmd.encode())

    time.sleep(0.1)
    res = ser.read_all()
    print(res.decode())

if args.irun:
    cmd = 'irun\r\n'
    ser.write(cmd.encode())
    time.sleep(0.1)
    res = ser.read_all()
    print(res.decode())

if args.wrun:
    cmd = 'wrun\r\n'
    ser.write(cmd.encode())
    time.sleep(0.1)
    res = ser.read_all()
    print(res.decode())    

if args.off:
    cmd = 'stop\r\n'
    ser.write(cmd.encode())
    time.sleep(0.1)
    res = ser.read_all()
    print(res.decode())

if args.test is not None:
    x = args.irate[0]
    unit = args.irate[1]
    cmd = 'irate ' + x + ' ' + unit + '\r\n'
    print(cmd)

ser.close()