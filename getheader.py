from spotify import *
import os

file = open('auth.json', 'r+')
file.truncate(0)
file.close()
print(authorize())