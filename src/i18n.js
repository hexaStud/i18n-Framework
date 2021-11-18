/** @class */ function I18n(translation) {
    let translationFile;
    const events = new Map();
    loadTranslation(translation).then((translation) => {
        translationFile = translation;
        emit("load");
    });

    async function loadTranslation(translation) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        let obj = JSON.parse(this.responseText);
                        resolve(obj);
                    } catch (err) {
                        throw err;
                    }
                }
            }
            xhr.open("POST", translation, true);
            xhr.send();
        });
    }

    function update() {
        if (!!translationFile) {
            let elements = document.querySelectorAll("[i18n]");

            elements.forEach((ele) => {
                function setDefault() {
                    if (ele.hasAttributes("i18nDefault")) {
                        ele.innerHTML = ele.getAttribute("i18nDefault")
                    }
                }

                let path = ele.getAttribute("i18n");
                if (!!path) {
                    let t;
                    if (!!(t = getTranslation(path))) {
                        ele.innerHTML = t;
                    } else {
                        setDefault();
                    }
                }
            });
        }
    }

    function getTranslation(path) {
        let pathSegments = path.split(">");
        let value = translationFile;
        for (const segment of pathSegments) {
            value = value[segment];
            if (!value) {
                console.error("Translation path does not exists");
                return null;
            }
        }
        if (typeof value === "object" || typeof value === "function" || Array.isArray(value)) {
            console.error("Datatype is not supported");
            return null;
        } else {
            return value;
        }
    }

    /**
     * @param ev {"load"}
     * @param cb
     */
    function on(ev, cb) {
        if (events.has(ev)) {
            let evs = events.get(ev);
            evs.push(cb);
            events.set(ev, evs);
        } else {
            events.set(ev, [
                cb
            ]);
        }
    }

    /**
     * @param ev {"load"}
     */
    function emit(ev) {
        if (events.has(ev)) {
            let evs = events.get(ev);
            for (const ev of evs) {
                ev();
            }
        }
    }

    return {
        on,
        update,
        getTranslation,
        load: loadTranslation
    }
}
