// Утилиты
const TinkoffInvestPluginUtils = {
	styleObjectToString(styleString) {
		return Object.entries(styleString).reduce((styleString, [propName, propValue]) => `${styleString}${propName.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}:${propValue};`, '')
	},
	// Стили
	TinkoffInvestPluginStyles: {
		colorDanger: '#db3737',
		colorSuccess: '#0f9960',
		colorWhite: '#fff',
		transitionDurationMs: 200,
		transitionTimeFunc: 'ease-in-out',
		boxShadow: 'inset 0 0 0 1px rgba(16, 22, 26, 0.4), inset 0 -1px 0 rgba(16, 22, 26, 0.2)',
		borderRadius: '3px',
	},
}

// Уведомлялка
const TinkoffInvestPluginNotice = {
	TinkoffInvestPluginNoticeStyles: {
		position: 'absolute',
		bottom: '8px',
		left: '-300px',
		padding: '8px 12px',
		minWidth: '240px',
		maxWidth: '300px',
		zIndex: 1000,
		color: TinkoffInvestPluginUtils.TinkoffInvestPluginStyles.colorWhite,
		transition: `all ${TinkoffInvestPluginUtils.TinkoffInvestPluginStyles.transitionDurationMs}ms ${TinkoffInvestPluginUtils.TinkoffInvestPluginStyles.transitionTimeFunc}`,
		backgroundColor: TinkoffInvestPluginUtils.TinkoffInvestPluginStyles.colorSuccess,
		boxShadow: TinkoffInvestPluginUtils.TinkoffInvestPluginStyles.boxShadow,
		borderRadius: TinkoffInvestPluginUtils.TinkoffInvestPluginStyles.borderRadius,
	},
	create({ message, type = 'success' }) {
		const hideTime = 3000
		const TinkoffInvestPluginNotice = document.createElement('div')
		TinkoffInvestPluginNotice.classList.add('TinkoffInvestPluginNotice')
		TinkoffInvestPluginNotice.innerHTML = message
		TinkoffInvestPluginNotice.setAttribute('style', TinkoffInvestPluginUtils.styleObjectToString(this.TinkoffInvestPluginNoticeStyles))
		
		if (type === 'success') {
			TinkoffInvestPluginNotice.style.backgroundColor = TinkoffInvestPluginUtils.TinkoffInvestPluginStyles.colorSuccess
		} else {
			TinkoffInvestPluginNotice.style.backgroundColor = TinkoffInvestPluginUtils.TinkoffInvestPluginStyles.colorDanger
		}

		document.querySelector('body').append(TinkoffInvestPluginNotice)

		setTimeout(() => this.show(TinkoffInvestPluginNotice), 20)
		setTimeout(() => this.hide(TinkoffInvestPluginNotice), hideTime)
		setTimeout(() => this.delete(TinkoffInvestPluginNotice), hideTime + TinkoffInvestPluginUtils.TinkoffInvestPluginStyles.transitionDurationMs)
	},
	show(noticeElement) {
		noticeElement.style.left = '8px'
	},
	hide(noticeElement) {
		noticeElement.style.opacity = 0
	},
	delete(noticeElement) {
		noticeElement.remove()
	},
}

// Плагин горячих клавиш
const TinkoffInvestPluginHotkeys = {
	// Селекторы html-элементов
	els: {
		orderButtons: {
			buy: document.querySelector('[class*=src-modules-Order-containers-components-OrderForm-OrderAction-styles-order] button.pt-intent-success'),
			sell: document.querySelector('[class*=src-modules-Order-containers-components-OrderForm-OrderAction-styles-order] button.pt-intent-danger'),
			returnToOrder: document.querySelector('[class*=src-modules-Order-containers-components-OrderComplete-styles-actions] button'),
		},
		orderInputs: {
			getPrice() { return document.querySelectorAll('[class*=src-modules-Order-containers-components-OrderForm-OrderFields-styles-inputs] [class*=src-components-NumericInput-styles-container] .pt-input')[0].value },
			getCount() { return document.querySelectorAll('[class*=src-modules-Order-containers-components-OrderForm-OrderFields-styles-inputs] [class*=src-components-NumericInput-styles-container] .pt-input')[1].value },
		},
	},
	// Действия
	execOrder(type) {
		if (!['buy', 'sell'].includes(type)) throw Error('Данный вид приказа не существует')

		if (this.els.orderButtons.returnToOrder) {
			this.els.orderButtons.returnToOrder.click()
			return
		}

		console.log('this.els.orderInputs.count.value :>> ', this.els.orderInputs.getPrice())
		console.log('this.els.orderInputs.price.value :>> ', this.els.orderInputs.getCount())
		if (!this.els.orderInputs.getPrice()) {
			TinkoffInvestPluginNotice.create({ message: 'Для выставления лимитной заявки нужно указать цену', type: 'danger' })
			return
		}

		if (!this.els.orderInputs.getCount()) {
			TinkoffInvestPluginNotice.create({ message: 'Укажите кол-во лотов', type: 'danger' })
			return
		}

		if (this.els.orderButtons[type]) {
			this.els.orderButtons[type].click()
		}
	},
	orderSell() {
		if (this.els.orderButtons.sell) {
			this.els.orderButtons.sell.click()
		}
	},
	returnToOrder() {
		if (this.els.orderButtons.returnToOrder) {
			this.els.orderButtons.returnToOrder.click()
		}
	},

	setKeyListeners() {
		document.addEventListener('keyup', event => {
			if (event.code === 'KeyB') this.execOrder('buy')
			else if (event.code === 'KeyS') this.execOrder('sell')
		})
	},
	usePlugin() {
		this.setKeyListeners()
		TinkoffInvestPluginNotice.create({ message: 'Плагин установлен' })
	},
}

TinkoffInvestPluginHotkeys.usePlugin()
