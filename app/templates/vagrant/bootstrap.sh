#!/usr/bin/env bash

sudo apt-get update
sudo apt-get install software-properties-common python-software-properties

# Install MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get -y install mongodb-org

# Install Redis
sudo add-apt-repository -y ppa:chris-lea/redis-server
sudo apt-get update
sudo apt-get install redis-server

# Copy Config Files
sudo cp /vagrant/redis.conf /etc/redis/redis.conf
sudo cp /vagrant/mongod.conf /etc/mongod.conf
chown root:root /etc/mongod.conf /etc/redis/redis.conf
chmod 644 /etc/mongod.conf /etc/redis/redis.conf

# Update Everything
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade
sudo reboot
