var arrayList;
function addToPage(_catalogElement) {
    $('.element-container').append('\
    <div class="courses-sci">\n\
        <div class="sci-figure">\n\
            <img src="https://www.imumk.ru/svc/coursecover/' + _catalogElement.courseId + '" alt="Демо-версия">\n\
        </div>\n\
        <div class="sci-info">\n\
            <p class="sci-title">' + _catalogElement.title + '</p>\n\
            <p class="sci-grade">' + _catalogElement.grade + ' классы</p>\n\
            <p class="sci-genre">Демо</p>\n\
            <p class="sci-meta">\n\
                <a href="/offer/230">Подробнее</a>\n\
            </p>\n\
            <p class="sci-controls">\n\
                <a href="#" class="pure-button pure-button-primary btn-fluid">' + (($("#rub-bonus").prop('checked')) ? _catalogElement.priceBonus + ' бон.' : _catalogElement.price + ' руб.') + '</a>\n\
            </p>\n\
        </div>\n\
    </div>');
}

$(document).ready(function () {
    $.post('http://krapipl.imumk.ru:8082/api/mobilev1/update/', function (data) {
        let subjects = [];
        let genre = [];
        let grade = [];
        arrayList = data.items;
        arrayList.forEach(function (_item, _index, _array) {
            addToPage(_item);
            if (!subjects.find(item => item == _item.subject)) {
                subjects.push(_item.subject);
            }
            if (!genre.find(item => item == _item.genre)) {
                genre.push(_item.genre);
            }
            let _grades_ = _item.grade.split(';');
            _grades_.forEach(function (_item, _index, _array) {
                if (!grade.find(item => item == _item)) {
                    grade.push(_item);
                }
            });
        });
        subjects.sort();
        genre.sort();
        grade.sort(function (a, b) {
            return a - b;
        });
        subjects.forEach(function (item, index, array) {
            $('#subj').append('<option value="' + item + '">' + item + '</option>');
        });
        genre.forEach(function (item, index, array) {
            $('#genre').append('<option value="' + item + '">' + item + '</option>');
        });
        grade.forEach(function (item, index, array) {
            $('#grade').append('<option value="' + item + '">' + item + '</option>');
        });
        $('#floatingCirclesG').hide();
    });
});
$('#subj, #genre, #grade, #rub-bonus').on('change', startFilter);
$("#borderFind").keyup(function (event) {
    startFilter();
});
function startFilter() {
    filterArray($('#subj').val(), $('#genre').val(), $('#grade').val(), $('#borderFind').val());
}

function filterArray(_subject, _genre, _grade, _search) {
    $('.element-container').empty();
    $('#floatingCirclesG').show();
    let isFind = false;
    arrayList.forEach(function (_item, _index, _array) {
        let addElement = true;
        if (_subject != 0) {
            if (_item.subject != _subject) {
                addElement = false;
            }
        }
        if (_genre != 0) {
            if (_item.genre != _genre) {
                addElement = false;
            }
        }

        if (_grade != 0) {
            let _grades_ = _item.grade.split(';');
            if (!_grades_.find(item => item == _grade)) {
                addElement = false;
            }
        }
        if (_search.trim() != '') {

            let a = _item.title.toLowerCase();
            let b = _search.toLowerCase();
            if (a.indexOf(b) < 0) {
                addElement = false;
            }
        }

        if (addElement) {
            isFind = true;
            addToPage(_item);
        }
    });
    if (!isFind) {
        $('.element-container').append('<p style="font-size:20px; text-align:center;">Ничего не найдено...</p>');
    }
    $('#floatingCirclesG').hide();
}