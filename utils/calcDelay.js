function msToTime(milliseconds) {
    const hours = String(Math.floor(milliseconds / (1000 * 60 * 60))).padStart(
      2,
      "0"
    );
    const minutes = String(
      Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    ).padStart(2, "0");
    const seconds = String(
      Math.floor((milliseconds % (1000 * 60)) / 1000)
    ).padStart(2, "0");
  
    console.log(`${hours}:${minutes}:${seconds}`);
}

module.exports = msToTime