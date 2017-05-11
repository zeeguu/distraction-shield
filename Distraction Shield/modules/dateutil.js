// This module is an utility to help get the correct format for dates which are used in the codebase.

    // Converts seconds to the format HH:MM:SS
    export function secondsToHHMMSS(seconds) {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    // Formats the date parameter to DD/MM/YY
    export function formatDate(date){
        return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    }

    // Function which returns the current date, formatted in the correct format.
    export function getToday(){
        let dateObject = new Date();
        return formatDate(dateObject);
    }
