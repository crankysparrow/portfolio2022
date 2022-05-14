function debounce(func, wait, immediate) {
	var timeout

	return function executedFunction() {
		var context = this
		var args = arguments

		var later = function () {
			timeout = null
			if (!immediate) func.apply(context, args)
		}

		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}

function navSetup() {
	let nav = document.querySelector('nav.nav')
	let btn = document.querySelector('nav #nav-open')
	let list = document.querySelector('ul.nav-list')
	let links = list.querySelectorAll('a')

	btn.addEventListener('click', () => {
		if (btn.getAttribute('aria-expanded') == 'false') {
			openMobileMenu()
		} else {
			closeMobileMenu()
		}
	})

	function openMobileMenu() {
		btn.setAttribute('aria-expanded', 'true')
		list.setAttribute('aria-hidden', 'false')
		list.style.display = 'block'
		setTimeout(() => {
			list.classList.add('open')
		})
	}

	function closeMobileMenu() {
		btn.setAttribute('aria-expanded', 'false')
		list.setAttribute('aria-hidden', 'true')
		list.classList.remove('open')
		list.addEventListener('transitionend', onListTransitionEnd)
	}

	function onListTransitionEnd(e) {
		if (e.target == list) {
			list.style.display = 'none'
			list.removeEventListener('transitionend', onListTransitionEnd)
		}
	}

	function resizeListener() {
		if (window.innerWidth >= 768) {
			list.style.display = 'flex'
		} else {
			list.style.display = 'none'
			list.classList.remove('open')
			btn.setAttribute('aria-expanded', 'false')
			list.setAttribute('aria-hidden', 'true')
		}
	}

	window.addEventListener('resize', debounce(resizeListener, 200))
}

navSetup()
