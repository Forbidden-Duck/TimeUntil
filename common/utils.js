let document;
let listPage;
let datePage;
let titleText;
let daysText, hoursText, minsText, secsText;

let interval;

export function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

export function zeroPadDays(i) {
    if (i < 100
        && i > 10) {
        i = "0" + i;
    } else if (i < 10) {
        i = "00" + i;
    }
    return i;
}

export function loadDocument(doc) {
    document = doc;
    listPage = document.getElementById("listPage");
    datePage = document.getElementById("date");
    titleText = document.getElementById("title");

    daysText = document.getElementById("days");
    hoursText = document.getElementById("hours");
    minsText = document.getElementById("mins");
    secsText = document.getElementById("secs");
}

export function openDate() {
    if (!document) {
        return;
    }
    datePage.class = "visible";
    listPage.class = "hidden";
}

export function openList() {
    if (!document) {
        return;
    }
    unloadTimeFromDate();
    datePage.class = "hidden";
    listPage.class = "visible";
}

export function loadTimeIntoDate(now, then) {
    if (!document) {
        return;
    }
    const difference = then.getTime() - now.getTime();
    // Days, Hours, Minutes, Seconds
    const time = [
        Math.floor(difference / 3600000 / 24),
        Math.floor((difference / 3600000) % 24),
        Math.floor((difference / 60000) % 60),
        Math.floor((difference / 1000) % 60)
    ];
    daysText.text = zeroPadDays(time[0]);
    hoursText.text = zeroPad(time[1]);
    minsText.text = zeroPad(time[2]);
    secsText.text = zeroPad(time[3]);

    clearTimeInterval();
    interval = setInterval(() => {
        loadTimeIntoDate(new Date(), then);
    }, 1000);
}

export function clearTimeInterval() {
    if (interval) {
        clearInterval(interval);
        interval = undefined;
    }
}

export function unloadTimeFromDate() {
    clearTimeInterval()
    daysText.text = "000";
    hoursText.text = "00";
    minsText.text = "00";
    secsText.text = "00";
}

export function ageFromDate(date) {
    const now = new Date();
    let age = now.getFullYear() - date.getFullYear();
    if (!(now.getMonth() == date.getMonth()
        && now.getDate() >= date.getDate())) {
        age--;
    }
    return age;
}

export function birthdayToMonthDay(date) {
    const MONTHS =
        [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun",
            "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec"
        ];
    return `${ordinalSuffix(date.getDate())} ${MONTHS[date.getMonth()]}`;
}

export function ordinalSuffix(day) {
    const
        j = day % 10,
        k = day % 100;

    if (j == 1 && k !== 11) {
        return day + "st";
    }
    if (j == 2 && k != 12) {
        return day + "nd";
    }
    if (j == 3 && j != 13) {
        return day + "rd";
    }
    return day + "th";
}