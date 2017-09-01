document.addEventListener('DOMContentLoaded', function () { // Дождаться, пока документ загрузится полностью
	var
		$form = $("#myForm"),
		$inputFio = $("input[name=fio]"),
		$inputEmail = $("input[name=email]"),
		$inputPhone = $("input[name=phone]"),
		$submitButton = $("#submitButton"),
		$resultContainer = $("#resultContainer");

	var myForm = {
		// Определяем метод getData(), который возвращает объект inputs с инпутами
		getData: function () {
			var inputs = {};
			inputs.fio = $inputFio.val();
			inputs.email = $inputEmail.val();
			inputs.phone = $inputPhone.val();
			return inputs;
		},
		// Определяем метод setData(), который принимает объект с данными формы и устанавливает их инпутам формы. 
		// Поля кроме phone, fio, email игнорируются.
		setData: function (o) {
			for (var prop in o) {
				if (prop === "fio") {
					$inputFio.val(o.fio);
				}
				if (prop === "email") {
					$inputEmail.val(o.email);
				}
				if (prop === "phone") {
					$inputPhone.val(o.phone);
				}
			}
		},
		isValid: false, // Задаем начальное значение признака валидации формы
		errs: [], // Создаем пустой массив для сохранения названий полей, не прошедших валидацию в методе submit()
		submit: function () {
			// Если признак валидации равен false при запуске метода submit, удалить класс error у полей формы и контейнера div
			if (!myForm.isValid) {
				$resultContainer.removeClass("error");
				$("input").removeClass("error");
			}
			// Если массив errs не пустой, присвоить массиву errs и isValid значения по умолчанию
			// для предотвращения дублирования значений в указанных переменных
			if (myForm.errs.length !== 0) {
				myForm.errs = [];
				myForm.isValid = false;
			}

			// Определение переменных инпутов метода submit() с помощью метода getData()
			var inputData = myForm.getData();
			var fio = inputData.fio;
			var eml = inputData.email;
			var phone = inputData.phone;


			function checkFio() {
				// Регулярное выражение для проверки ФИО:допускается использовать символы кирилицы и латиницы.
				// В каждом слове должно быть не менее 1 символа; между словами 1 или более пробельных символа (пробел, табуляция).
				var patfio = /^[А-Яа-яЁёA-Za-z]+\s+[А-Яа-яЁёA-Za-z]+\s+[А-Яа-яЁёA-Za-z]+$/;
				if (patfio.test(fio)) { // Если ФИО соответствует регулярному выражению
					return true; // вернуть true, поле ФИО прошло валидацию
				}
				else { // в противном случае
					$inputFio.addClass("error"); // установить класс error полю ФИО
					myForm["errs"].push("Fio"); // добавить название поля в массив errs полей, не прошедших валидацию
					return false; // вернуть false, поле ФИО не прошло валидацию
				}
			}

			function checkEmail() {
				// Регулярное выражение для проверки email
				var pateml = /^[a-zA-Z0-9][a-zA-Z0-9.+_-]+@((ya\.ru)|(yandex\.ru)|(yandex\.ua)|(yandex\.by)|(yandex\.kz)|(yandex\.com))$/
				var emltest = pateml.test(eml); // Проверяем email с помощью регулярного выражения
				if (emltest) { // Если Email соответствует регулярному выражению
					return true; // вернуть true, поле Email прошло валидацию
				}
				else { // в противном случае
					$inputEmail.addClass("error"); // установить класс error полю Email
					myForm["errs"].push("Email"); // добавить название поля в массив errs полей, не прошедших валидацию
					return false; // вернуть false, поле Email не прошло валидацию
				}
			}

			function checkPhone() {
				// Преобразование строки номера телефона в массив цифр без символов '(', ')', '+', '-'
				var phonenum = phone.match(/\d/g).join(",").split(',').map(Number);
				// Определение суммы цифр номера телефона
				var sum = 0; // Объявление переменной sum для сохранения суммы и присвоение ей значения 0
				phonenum.forEach(function (value) {
					sum += value
				});
				// Регулярное выражение для проверки номера телефона
				var patphone = /^\+7\(\d{3}\)\d{3}\-\d{2}\-\d{2}$/;
				var phonetest = patphone.test(phone); // Проверка введенного ноера телефона с помощью регурного выражения
				if ((phonetest === true) && sum <= 30) { // Если номер телефона соответствует регулярному выражению и сумма его цифр не превышает 30
					return true; // вернуть true, поле Телефон прошло валидацию
				}
				else {
					$inputPhone.addClass("error"); // установить класс error полю Телефон
					myForm["errs"].push("Phone"); // добавить название поля в массив errs полей, не прошедших валидацию
					return false; // вернуть false, поле Телефон не прошло валидацию
				}
			}

			// Сохраняем в переменные возращаемые значения прохождения валидации каждого поля
			var cf = checkFio();
			var ce = checkEmail();
			var cp = checkPhone();
			if (cf && ce && cp) {
				myForm.isValid = true; // Валидация всех полей прошла успешно
				$submitButton.attr("disabled", "true"); // Сделать кнопку Отправить неактивной
			}
			else {
				myForm.isValid = false; // Валидация некоторых полей не прошла
			}

			// Функция randomUrl() производит произвольный выбор из заданных аргументов и возвращает выбранный вариант
			function randomUrl(url1, url2) {
				var arr = [url1, url2];
				var url = arr[Math.floor(Math.random() * arr.length)];
				return url;
			}

			// Функция selectRequest() производит произвольный выбор адреса запроса.
			// Вначале функция проверяет наличие классов success, error или progress у контейнера <div id="resultContainer">.
			// При наличии одного из указанных классов класс контейнера удаляется.
			// При прохождении валидации всех полей происходит рандомный выбор между адресами для запроса к success.json или progress.json.
			// В противном случае - между адресами для запроса к error.json или progress.json.
			function selectRequest() {
				$resultContainer.removeClass("progress");
				if (myForm.isValid) {
					var url1 = randomUrl("success.json", "progress.json");
					console.log(url1, myForm.isValid);
					requestAll(url1);
				}
				else {
					var url2 = randomUrl("error.json", "progress.json");
					console.log(url2, myForm.isValid);
					requestAll(url2);
				}
			}

			// Функция requestAll осуществляет ajax-запрос к файлам success.json, error.json или progress.json.
			// Если валидация всех полей формы прошла успешно, отправляется ajax-запрос к файлам success.json или progress.json.
			// Если валидация хотя бы одного поля формы не прошла, отправляется ajax-запрос к error.json или progress.json.
			// Для отправки ajax-запроса используется функция библиотеки jQuery jQuery.getJSON(), в качестве первого аргумента которой
			// используется url к json-файлам.
			// Второй аргумент - функция, получающая в качестве аргумента возращаемый json-файл и
			// устанавливающая содержимое и класс контейнера <div id="resultContainer">.
			function requestAll(url) {
				$.getJSON(url, function (data) {
					switch (url) {
						case "success.json":
							// Устанавливаем класс success контейнеру с id=resultContainer
							$resultContainer.addClass(data.status);
							// Выводим содержимое поля status файла success.json, возвращаемого функцией $.getJSON,
							// в контейнер с id=resultContainer
							$resultContainer.text(data.status);
							break;
						case "error.json":
							// Устанавливаем класс error контейнеру с id=resultContainer
							$resultContainer.addClass(data.status);
							// Выводим содержимое поля reason файла error.json, возвращаемого функцией $.getJSON,
							// в контейнер с id=resultContainer
							$resultContainer.text(data.reason + myForm.errs.join(", "));
							break;
						case "progress.json":
							$resultContainer.text(data.status);
							// Устанавливаем класс progress контейнеру с id=resultContainer
							$resultContainer.addClass(data.status);
							// Вызывается функция selectRequest() для выбора адреса запроса через timeout милисекунд
							//из соответствующего поля progress.json, возвращаемого функцией getJSON
							setTimeout(selectRequest, data.timeout);
							break;
						default:
							console.log("This path doesn't support. Choose success.json, error.json or progress.json.")
					}
				});
			}
			requestAll($("#myForm").attr("action")); // Начинаем с обращения к адресу из атрибута action формы
		},

		// Метод validate() для валидации полей формы использует метод submit()
		validate: function () {
			// Если массив errs не пустой, присвоить массиву errs и isValid значения по умолчанию
			// для предотвращения дублирования значений в указанных переменных
			if (myForm.errs.length !== 0) {
				myForm.errs = [];
				myForm.isValid = false;
			}
			myForm.submit();
			return { // Вернуть объект с признаком результата валидации (isValid) и массивом названий полей, которые не прошли валидацию (errorFields).
				isValid: myForm.isValid,
				errorFields: myForm.errs
			};
		}
	};

	// Слушаем событие клика кнопки Отправить
	$submitButton.on('click', function (event) {
		// Предотвращаем системную отправку
		event.preventDefault();
		myForm.submit();
	});

	// Тестовый объект для проверки setData()
	var dt2 = {
		fio: "Петров Алексей Иванович",
		email: "mpn@ya.ru",
		address: "SPB, Nevsky",
		phone: "+7(900)101-10-01",
		date: "2017-08-25"
	};
	// myForm.setData(dt2); // Для проверки работы метода setData() надо снять комментарии в начале строки
});