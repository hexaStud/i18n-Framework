/** @class */ function I18n(translation) {
    let translationFile;
    loadTranslation(translation).then((translation) => {
        translationFile = translation;
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


    function load() {
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
        pathSegments = path.split(">");
        let value = translationFile;
        for (const segment of pathSegments) {
            value = translationFile[segment];
            if (!!value) {
                return null;
                console.error("Translation path does not exists");
            }
        }
        if (typeof value === "object" || typeof value === "function" || Array.isArray(value)) {
            return null
            console.error("Datatype is not supported");
        } else {
            return value
        }
    }

    return {
        load,
        getTranslation
    }
}