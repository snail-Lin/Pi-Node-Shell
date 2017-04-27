NATAPPPATH='/home/pi/Desktop'

rm ${NATAPPPATH}/aria.out
rm ${NATAPPPATH}/ssh.out

PROCESS=`ps -u pi -w 1000|grep natapp|grep -v grep|grep -v PPID|awk '{ print $1}'`
for i in $PROCESS
do
  echo "Kill the $1 process [ $i ]"
  kill -9 $i
done

nohup ${NATAPPPATH}/natapp -authtoken="***" -log=stdout > ${NATAPPPATH}/aria.out &
echo "6800端口隧道已打开"

nohup ${NATAPPPATH}/natapp -authtoken="***" -log=stdout > ${NATAPPPATH}/ssh.out &
echo "ssh隧道已打开"

sleep 6

grep -n 'http' nohup.out | tail -n 1|awk  '{ print $8 }'
grep -n 'tcp' nohup.out |tail -n 1 |awk '{print $8}'


if ps -u root|grep natapp|grep -v -q grep
then 
        echo 'ssh tunnel open'
else
        sudo nohup ${NATAPPPATH}/natapp -authtoken=b9e401f983fb887a -log=stdout > ${NATAPPPATH}/web.out &
        echo 'ssh tunnel reopen'
fi

