
( function () {

var closeAddEventContainerButton = document.querySelector('.add-event__close-modal-content');
var eventName = document.forms[0].eventName;
var eventDate = document.forms[0].eventDate;
var eventNames = document.forms[0].eventNames;
var eventDescr = document.forms[0].eventDescr;

highlightEvents();


 $.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );

  $( "#eventDate" ).datepicker({
   	dateFormat: "dd.mm.yy",
   	onSelect: function() {
    $(this).blur();
    
 	}
 });	
   	
  


// функция нахождения координат.
function getCoords(elem) { 
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
    bottom: box.bottom + pageYOffset
  };

}

//закрытия окна добавления события
closeAddEventContainerButton.addEventListener ('click', function (event) {
	addEventContainer.style.display = 'none';
	document.querySelector('td.active').classList.remove("active");
	// очищаем поля создания события
	eventName.value= '';
	eventDate.value= '';
	eventNames.value= '';
	eventDescr.value= '';
	// убираем классы с инпутов

	eventName.classList.remove("invalid-class");
	eventName.classList.remove("valid-class");
	eventDate.classList.remove("invalid-class");
	eventDate.classList.remove("valid-class");
	eventNames.classList.remove("invalid-class");
	eventNames.classList.remove("valid-class");
});

// показ окна добавлния события
calendar.addEventListener('click',function(event) {
  var target = event.target;
  // если был предыдущий активный день, то убираем с него этот класс.
  var prevTD = document.querySelector('td.active');
  if ( !(prevTD == null) )  {
  	prevTD.classList.remove('active');
  }
  while (target != calendar) {
    if (target.tagName == 'TD') {
	  var targetCoords = getCoords(target);
      // расстояние от активной ячейки до правого края страницы
      var rightLength = document.documentElement.clientWidth - targetCoords.left;
	  addEventContainer.style.display = 'block';
      addEventContainer.classList.remove('right');
      if ( addEventContainer.clientWidth  < ( rightLength -20 ) )
    	  { 
            addEventContainer.style.top = targetCoords.top + 20 + 'px';
    	    addEventContainer.style.left = targetCoords.left + 70 + 'px';
          }
          else {

            addEventContainer.classList.add('right');
            addEventContainer.style.top = targetCoords.top + 20 + 'px';
            addEventContainer.style.left =targetCoords.left - addEventContainer.clientWidth  + 70 + 'px';

          }
	  target.classList.add("active");
      return;
    		}

    target = target.parentNode;
		}
});

// запись события в ячейку html

addEventOK.addEventListener('click', function(event) {
	event.preventDefault();
	var target = document.querySelector('td.active');
	target.querySelector('.event-name').textContent = eventName.value;
	target.querySelector('.event-date').textContent = eventDate.value;
	target.querySelector('.event-names').textContent = eventNames.value;
	target.querySelector('.event-descr').textContent = eventDescr.value;


	// добавляем событие в объект псевдо БД

	var eventObj = { title: eventName.value,
					  date: eventDate.value	}
	dbArticles.push(eventObj);

	// убираем классы с инпутов

	eventName.classList.remove("invalid-class");
	eventName.classList.remove("valid-class");
	eventDate.classList.remove("invalid-class");
	eventDate.classList.remove("valid-class");
	eventNames.classList.remove("invalid-class");
	eventNames.classList.remove("valid-class");

	event.target.disabled = true;

	// очищаем поля создания события
	eventName.value= '';
	eventDate.value= '';
	eventNames.value= '';
	eventDescr.value= '';

	highlightEvents();


});

// удаление события
addEventDelete.addEventListener('click', function(event) {
	event.preventDefault();
	var target = document.querySelector('td.active');
	
	// удаление из массива объектов если дата активного события равна дате в БД то удаляем объект из БД
	for (var i = 0; i < dbArticles.length; i++) {
		if  ( dbArticles[i].date === target.querySelector('.event-date').textContent && dbArticles[i].title === target.querySelector('.event-name').textContent )
			delete dbArticles[i];
	}


	// удаление из html
	target.querySelector('.event-name').textContent = '';
	target.querySelector('.event-date').textContent = '';
	target.querySelector('.event-names').textContent = '';
	target.querySelector('.event-descr').textContent = '';
	highlightEvents();

});

// ячейки с событиями подсвечиваются

function highlightEvents () {
	var eventsFileds = document.querySelectorAll('span.event-name');

	for (var i = 0; i < eventsFileds.length; i++) {
		if ( !(eventsFileds[i].textContent == '') ) {
			eventsFileds[i].parentNode.parentNode.style.backgroundColor = '#C1E4FF';

		}
		else eventsFileds[i].parentNode.parentNode.style.backgroundColor = 'inherit';
	}

}


// очистка поля поиска 
clearSearch.addEventListener('click', function(event) {
	superSearch.value = '';
})


// простая проверка формы на валидность 

eventName.addEventListener('blur',function validateEventName (event) {
		
		if (event.target.value == '')
			event.target.classList.add("invalid-class");
		 else {
	      event.target.classList.remove("invalid-class");
	      event.target.classList.add("valid-class");
	      makeSubmitButtonEnabled.call(event.target);
	      
	    }
	  });

eventDate.addEventListener('blur',function validateEventDate (event) {

		function validate() {
			console.log(event.target.value);
			if ( event.target.value === '')
			event.target.classList.add("invalid-class");
		 else {
	      event.target.classList.remove("invalid-class");
	      event.target.classList.add("valid-class");
	      makeSubmitButtonEnabled.call(event.target);
	      
	    	}
		};
		// почему то значение из дейтпикера не успевает поменяться до валидаци
		setTimeout( validate, 120); 
		
	  });

eventNames.addEventListener('blur',function validateEventNames (event) {
		
		if (event.target.value == '')
			event.target.classList.add("invalid-class");
		 else {
	      event.target.classList.remove("invalid-class");
	      event.target.classList.add("valid-class");
	      makeSubmitButtonEnabled.call(event.target);
	      
	    }
	  });


// проверка всех полей на валидность, есди да то включаем кнопку готово
function makeSubmitButtonEnabled() {
	var inputs = this.form.getElementsByTagName('input');
	var sumbitButton = this.form.querySelector('.add-event__OK');
	var counter = 0;
	
	for (var i = 0; i < inputs.length; i++) {
	if 	( inputs[i].classList.contains('valid-class') )
		counter++;
	}
	

	if ( inputs.length==counter ) 
		sumbitButton.disabled = false;

}

  }());




// плагин поиска 


  var dbArticles = [
                                        {title: "Стрижка кота",
                                    	 date: "15.10.17"								},
                                       
                                    ];

        (function ( $ ) {

            $.fn.autoSearch = function() {

                var request = '';
                var input = this;

                input.wrap('<div class="searchHolder"></div>');
                input.parent().append('<div class="autoFillBar scrollbar"></div>');
                var autoFillBar = input.next();
                

                input.on('focus', function(){

                    searchCheck();

                });

                input.on('keyup', function(e){
                    if (e.keyCode == 40){

                        if (autoFillBar.find('.active').length == 0){
                            autoFillBar.find('.item:first').addClass('active');
                        } else {
                            autoFillBar.find('.active').removeClass('active').next().addClass('active');
                        }

                        var val = autoFillBar.find('.active').text();
                        input.val(val);

                    } else if (e.keyCode == 38) {

                        if (autoFillBar.find('.active').length == 0){
                            autoFillBar.find('.item:last').addClass('active');
                        } else {
                            autoFillBar.find('.active').removeClass('active').prev().addClass('active');
                        }

                        var val = autoFillBar.find('.active').text();
                        input.val(val);

                    } else if (e.keyCode == 13) {

                        //тут можно сделать переход на страницу статьи или все что пожелаешь

                    } else {

                        searchCheck();
                    }

                });

                autoFillBar.on('click', '.item', function(){

                    //тут можно сделать переход на страницу статьи или все что пожелаешь
                    input.val( $(this).text() );
                    return false;

                });

                $('html').on('click', function(e){

                    if ((!$(e.target).hasClass('autoFillBar')) && (!$(e.target).parent().hasClass('autoFillBar')) && (!$(e.target).parent().hasClass('searchHolder'))) {

                        autoFillBar.slideUp('fast', function(){
                            autoFillBar.children().remove();
                        });
                    }
                });


                function searchCheck(){


                    if (input.val().length >= 2){

                        // тут нужно будет описать ajax-запрос к бэкэнду, который вернет результаты поиска

                        var data = {};
                        data.action = 'search';
                        data.request = input.val();

                        // ajax-запрос на сервер, откомментируй, когда будет куда отсылать POST

//                        $.ajax({
//                            url: '/',
//                            type: 'POST',
//                            dataType: 'json',
//                            data: data
//                        }).done(function(data){

                                    autoFillBar.children().remove();

                                    // следующая строчка читает результат ajax-запроса, откомментируй ее, когда будет готов бэкэнд
                                    // var articlesArray = data.result;

                                    // Здесь я описываю фейковый поиск, чтобы продемонстрировать работу плагина
                                    // строки 241 - 262 можно выпилить несчадно
                                    // поиск ведется только по одному слову, но твоя база точно может лучше ;)
                                    var articlesArray = [];

                                 

                                    for (var j=0; j<dbArticles.length; j++){

                                        var searchRequestStart = new RegExp('^' + input.val() + '.*', 'i');
                                        var searchRequestMiddle = new RegExp(' ' + input.val() + '.*', 'i');

                                        if ( (searchRequestStart.test(dbArticles[j].title)) || (searchRequestMiddle.test(dbArticles[j].title)) ) {

                                            articlesArray.push(dbArticles[j]);
                                        }
                                    }

                                    // Здесь фейк заканчивается и начинаются чудеса

                                    for (var i=0; i <= articlesArray.length - 1; i++){

                                        var name = articlesArray[i].title;
                                        var date = articlesArray[i].date;
                                        var regex = input.val();

                                        if (regex.indexOf(' ') == -1){
                                            var searchMask = regex;
                                            var regEx = new RegExp(searchMask, "ig");

                                            var num = name.toLowerCase().indexOf(regex.toLowerCase());
                                            var strname = name.substr(num, regex.length);
                                            var replaceMask = '<b class="highlighted">' + strname + '</b>';
                                            name = name.replace(regEx, replaceMask);

                                        } else {


                                            var regexArr = regex.split(' ');

                                            for(var n=0; n<regexArr.length; n++){

                                                if (regexArr[n].length > 0){
                                                    var searchMask = regexArr[n];
                                                    var regEx = new RegExp(searchMask, "ig");

                                                    var num = name.toLowerCase().indexOf(regexArr[n].toLowerCase());
                                                    var strname = name.substr(num, regexArr[n].length);
                                                    var replaceMask = '<b class="highlighted">' + strname + '</b>';
                                                    var stopWords = '<b class="highlighted"></b>';
                                                    if (stopWords.indexOf(strname.toLowerCase()) == -1){
                                                        name = name.replace(regEx, replaceMask);
                                                    }
                                                }
                                            }
                                        }

                                        autoFillBar.append('<div class="item">' +
                                                '<b>' + name + '</b>' + '<br>' +
                                                '<i>' + date + '</i>' +
                                                '</div>');
                                    }

                                    autoFillBar.slideDown('fast');

                                  // конец ajax-запроса, ты знаешь, что делать ;)
//                                })
                    }
                }

                return input;
            };

            $(document).ready(function(){

                $('#superSearch').autoSearch();

            });

        }( jQuery ));