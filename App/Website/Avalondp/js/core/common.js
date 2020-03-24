
function loadUtilityFunction() {

    //Extending String and Object prototypes
    !function () {
        function _dynamicSortMultiple(attr) {
            var props = arguments;
            return function (obj1, obj2) {
                var i = 0, result = 0, numberOfProperties = props.length;
                while (result === 0 && i < numberOfProperties) {
                    result = _dynamicSort(props[i])(obj1, obj2);
                    i++;
                }
                return result;
            }
        }
        function _dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1, property.length - 1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }

        Object.defineProperty(Array.prototype, "sortBy", {
            enumerable: false,
            writable: true,
            value: function () {
                return this.sort(_dynamicSortMultiple.apply(null, arguments));
            }
        });

        String.prototype.replaceAll = function (replaceThis, withThis) {

            return this.replace(new RegExp(replaceThis, 'g'), withThis);
        };

        // ReSharper disable once NativeTypePrototypeExtending
        String.prototype.endsWith = function (pattern) {
            var d = this.length - pattern.length;
            return d >= 0 && this.lastIndexOf(pattern) === d;
        };

        // ReSharper disable once NativeTypePrototypeExtending
        String.prototype.toDate = function () {
            try {
                return this.substring(0, 10);
            } catch (e) {
                return "";
            }

        };

        // ReSharper disable once NativeTypePrototypeExtending
        String.prototype.toDBDate = function () {
            try {
                return this.substring(0, 10);
            } catch (e) {
                return "";
            }
        };

        // ReSharper disable once NativeTypePrototypeExtending
        String.prototype.contains = function (str2) {
            if (this.indexOf(str2) !== -1)
                return true;
            else
                return false;
        };
    }();
   
    $.util = {
        //decode querystring parameters by name
        queryString: function(name, url) {
            if (!url) {
                url = window.location.href;
            }
            var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(url);
            if (!results) {
                return undefined;
            }
            return results[1] || undefined;
        },
        //Clone to a new object with deep copy
        clone: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }

    


}
