createModule () {
    cd src
    if [ -d "./$1" ]
        then
            echo "'$1' module already exists."
            exit
    fi

    # sed is similar to (but not the same as) regex
    # This sed command replaces all dashes in a module name with spaces
    # The `<<<` tells the sed command that "$1" is out input string.
    humanCase=$(sed 's/-/ /g' <<< "$1")

    # Create module with the given name
    mkdir "$1"
    cd "$1"

    # Create HTML template file
    echo "<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>$humanCase</title>
    </head>
    <body>
        <script src="src/index.ts"></script>
    </body>
</html>" > development.html

    # Create JS template file
    mkdir src
    cd src
    echo "// Starting point for the $humanCase module" > index.ts
}


if [ $# -eq 0 ]
    then
        printf "\u001b[31;1mERR!\u001b[0m No Module name given.\n\n"
        printf "Please supply a module name when running this command.\n"
        printf "Example:\n\tnpm run new-module module-to-build\n\n"
        exit 
else
    createModule "$1"
fi