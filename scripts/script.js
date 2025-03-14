function timeLeft(matchTime,dateWise) {

    try {
        const dateStr = matchTime.split(",")[0];
        const matchDatetimeStr = `${dateWise} ${dateStr}`;
        // Create Date objects (Note: JavaScript's Date handling can be tricky with formats)
        const matchDate = new Date(matchDatetimeStr);
        const now = new Date();
        const timeDifference = matchDate.getTime() - now.getTime(); // Difference in milliseconds
        if (timeDifference < 0) {
            return "Live";
        }

        
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        if (days > 0) {
            return `${days}d ${hours}h`
        }
        else if (days <= 0 && hours > 0 && minutes > 0) {
            return ` ${hours}h ${minutes}m`
        }
        else if (minutes > 0 && seconds > 0) {
            return `${minutes}m ${seconds}s`
        }
        else if(seconds >0) {
            return `${seconds}s`
        }
        else{
            return null
        }
        //return`${days}d ${hours}h ${minutes}m ${seconds}s`
    } catch (err) {
        throw new Error(err);

    }
}

module.exports = { timeLeft }