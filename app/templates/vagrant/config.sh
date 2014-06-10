# Copy Config Files
sudo cp /vagrant/redis.conf /etc/redis/redis.conf
sudo cp /vagrant/mongod.conf /etc/mongod.conf
sudo chown root:root /etc/mongod.conf /etc/redis/redis.conf
sudo chmod 644 /etc/mongod.conf /etc/redis/redis.conf

