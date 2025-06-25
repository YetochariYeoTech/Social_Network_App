@echo off

echo Stopping any default MongoDB service...
net stop MongoDB

echo Starting MongoDB replica set members...
start cmd /k "mongod --replSet rs0 --port 27017 --dbpath C:\data\rs0\1 --bind_ip localhost"
start cmd /k "mongod --replSet rs0 --port 27018 --dbpath C:\data\rs0\2 --bind_ip localhost"
start cmd /k "mongod --replSet rs0 --port 27019 --dbpath C:\data\rs0\3 --bind_ip localhost"

echo Waiting 5 seconds for mongod processes to start...
timeout /t 5 > NUL

echo Initializing replica set...
mongosh --port 27017 --eval "rs.initiate({_id: ""rs0"", members: [{_id: 0, host: ""localhost:27017""}, {_id: 1, host: ""localhost:27018""}, {_id: 2, host: ""localhost:27019""}]})"

echo Done. MongoDB replica set should be ready.
timeout /t 3 > NUL


@REM @echo off

@REM echo ==========================================
@REM echo Stopping any default MongoDB service...
@REM echo ==========================================
@REM net stop MongoDB

@REM echo ==========================================
@REM echo Starting MongoDB replica set members...
@REM echo ==========================================
@REM start cmd /k "mongod --replSet rs0 --port 27017 --dbpath C:\data\rs0\1 --bind_ip localhost"
@REM start cmd /k "mongod --replSet rs0 --port 27018 --dbpath C:\data\rs0\2 --bind_ip localhost"
@REM start cmd /k "mongod --replSet rs0 --port 27019 --dbpath C:\data\rs0\3 --bind_ip localhost"

@REM echo ==========================================
@REM echo Waiting 5 seconds for mongod processes to start...
@REM echo ==========================================
@REM timeout /t 5 > NUL

@REM echo ==========================================
@REM echo Initializing replica set...
@REM echo ==========================================
@REM mongosh --port 27017 --eval "try {
@REM   rs.initiate({
@REM     _id: 'rs0',
@REM     members: [
@REM       { _id: 0, host: 'localhost:27017' },
@REM       { _id: 1, host: 'localhost:27018' },
@REM       { _id: 2, host: 'localhost:27019' }
@REM     ]
@REM   });
@REM } catch(e) { print('Replica set already initialized or error: ' + e); }"

@REM echo ==========================================
@REM echo Done. Your MongoDB replica set is ready.
@REM echo ==========================================
@REM timeout /t 3 > NUL
