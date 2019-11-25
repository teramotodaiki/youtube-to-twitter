from os import path
import sys
from pytube import YouTube

if len(sys.argv) <= 1:
    print('URL is required.')
if len(sys.argv) <= 2:
    print('Output path is required.')
    exit()

url = sys.argv[1]
output = sys.argv[2]
output_path = path.dirname(output)
filename, ext = path.splitext(path.basename(output))

stream = YouTube(url).streams.filter(
    progressive=True, subtype='mp4', resolution='720p').first()
if stream != None:
    stream.download(output_path=output_path, filename=filename)
else:
    print('Stream not found')
