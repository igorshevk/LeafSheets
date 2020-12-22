# Imports

import os
import sys
import boto3
import shutil
import brotli
import urllib3
import tarfile
import subprocess

from io import BytesIO
from tarfile import TarInfo

# Unpack (run once per 'cold start')

with open('/opt/lo.tar.br','rb') as file:
  read_file = file.read()
  data = brotli.decompress(read_file)
  with open('/tmp/lo.tar', 'wb+') as write_file:
    tar = tarfile.open(fileobj=BytesIO(data))
    for TarInfo in tar:
      tar.extract(TarInfo.name, path='/tmp/')

# Set some vars (run once per 'cold start')

s3_bucket = boto3.resource("s3").Bucket("leafsheets-django")
convertCommand = "/tmp/instdir/program/soffice.bin --headless --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --norestore --convert-to pdf --outdir /tmp"

# Handler

def lambda_handler(event,context):
  inputFileName = event['filename']
  # Put object wants to be converted in s3
  with open(f'/tmp/{inputFileName}', 'wb') as data:
      s3_bucket.download_fileobj(f'static/fixtures/docs/{inputFileName}', data)

  # Execute libreoffice to convert input file
  tries = 1
  success = False
  while not success:
    try:
      os.system(f"cd /tmp && {convertCommand} {inputFileName}")
      outputFileName, _ = os.path.splitext(inputFileName)
      outputFileName = outputFileName  + ".pdf"
      f = open(f'/tmp/{outputFileName}','rb')
      success = True
    except:
      if tries < 2:
        tries += 1
      else:
        break
        
  # Save the converted object to S3.
  s3_bucket.put_object(Key=f'private/documents/pdfs/user/{outputFileName}',Body=f,ACL="public-read")
  
  # Close the file
  f.close()