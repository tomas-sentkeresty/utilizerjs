import $global from '../../global';
import $strRemoveDiacritics from '../../1_primitives/string/strRemoveDiacritics';

export default function $arrOrderBy(arr, name, asc, maxlength) { // FROM TOTAL.JS EXCEPT JSON DATE COMPARISION
    var length = arr.length;
    if (!length || length === 1) {
        return arr;
    }
    if (typeof(name) === 'boolean') {
        asc = name;
        name = undefined;
    }
    if (maxlength === undefined) {
        maxlength = 3;
    }
    if (asc === undefined) {
        asc = true;
    }
    var type = 0;
    var field = name ? arr[0][name] : arr[0];
    switch (typeof(field)) {
        case 'string':
            type = 1;
            break;
        case 'number':
            type = 2;
            break;
        case 'boolean':
            type = 3;
            break;
        default:
            if (!(field instanceof Date) && !isNaN(field.getTime())) {
                return arr;
            }
            type = 4;
            break;
    }
    shellsort(function(a, b) {
        var va = name ? a[name] : a;
        var vb = name ? b[name] : b;
        if (type === 1) {
            if (va && vb) {
                if (asc) {
                    return $strRemoveDiacritics(va.substring(0, maxlength)).localeCompare($strRemoveDiacritics(vb.substring(0, maxlength)));
                }
                else {
                    return $strRemoveDiacritics(vb.substring(0, maxlength)).localeCompare($strRemoveDiacritics(va.substring(0, maxlength)));
                }
            }
            else {
                return 0;
            }
        }
        else if (type === 2) {
            if (va > vb) {
                return asc ? 1 : -1;
            }
            else if (va < vb) {
                return asc ? -1 : 1;
            }
            else {
                return 0;
            }
        }
        else if (type === 3) {
            if (va === true && vb === false) {
                return asc ? 1 : -1;
            }
            else if (va === false && vb === true) {
                return asc ? -1 : 1;
            }
            else {
                return 0;
            }
        }
        else if (type === 4) {
            if (!va || !vb) {
                return 0;
            }
            if (!va.getTime) {
                va = new Date(va);
            }
            if (!vb.getTime) {
                vb = new Date(vb);
            }
            var at = va.getTime();
            var bt = vb.getTime();
            if (at > bt) {
                return asc ? 1 : -1;
            }
            else if (at < bt) {
                return asc ? -1 : 1;
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    });
    return arr;
    function shellsort(fn) {
        var gapSize = Math.floor(length / 2);
        while (gapSize > 0) {
            shellInsertionSort(gapSize, fn);
            gapSize = Math.floor(gapSize / 2);
        }
    }
    function shellInsertionSort(gapSize, fn) {
        var i = 0;
        var j = 0;
        var tmp = null;
        for (i = gapSize; i < length; i += gapSize) {
            j = i;
            while (j > 0 && fn(this[j - gapSize], this[j]) === 1) {
                tmp = this[j];
                this[j] = this[j - gapSize];
                this[j - gapSize] = tmp;
                j -= gapSize;
            }
        }
    }
}
$global.$arrOrderBy = $arrOrderBy;
