FILE=$1
KEY=$2
IV=$3
IN="$FILE.textproto"
OUT="$FILE.pb.aes"

set -e;

protoc --encode=Family family.proto < $IN | \
    openssl enc -aes-256-cbc -out $OUT -p -K $KEY -iv $IV -nosalt 2> /dev/null

echo $KEY | xxd -r -p | base64
echo $IV | xxd -r -p | base64
