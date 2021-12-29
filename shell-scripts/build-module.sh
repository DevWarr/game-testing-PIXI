if [ $# -eq 0 ]
    then
        printf "\u001b[31;1mERR!\u001b[0m No Module name given.\n\n"
        printf "Please supply a module name when running this command.\n"
        printf "Example:\n\tnpm run build-module module-to-build\n\n"
        exit 
else
    webpack --env=moduleName=$1
fi