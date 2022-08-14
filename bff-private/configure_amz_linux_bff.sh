#!/bin/bash -xe

echo 'hello world' >> a.txt

# Read the first parameter into $SAMPLE_APP
if [[ "$1" != "" ]]; then
    echo "$1" >> a.txt
    SAMPLE_APP="$1"
else
    echo "Please specify the location of web application you are trying to deploy." >> a.txt
    exit 1
fi

# Install OS packages
sudo yum update -y
sudo yum groupinstall -y "Development Tools"

curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs

# Install bff-private into the /home/ec2-user/bff directory
sudo mkdir -p /var/www/bff
cp $SAMPLE_APP /var/www/bff/bff-private.zip
cd /var/www/bff
unzip bff-private.zip
rm bff-private.zip

npm install
PORT=3266 npm run start
