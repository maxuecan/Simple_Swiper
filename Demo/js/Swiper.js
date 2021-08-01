export default class Swiper{
	constructor(class_name) {
		this.class_name = class_name; // Class类名
		this.img_list = []; // 图片列表，可以修改为数字
		this.translateX = [-200, -100, 0, 250, 500, 600, 700]; // 写死的translateX
		this.scale = [0.55, 0.65, 0.8, 0.9, 0.8, 0.65, 0.55]; // 写死的缩放
		this.zIndex = [-3, -2, -1, 1, -1, -2, -3]; // 写死的Index
		this.li_obj = {}; // 子容器拥有的参数集合
		this.li_list = []; // 子容器列表
		this.key = null; // 用于清除定时器
		this.mousedown_start_clientX = null; // 鼠标按下长度
		this.mouseup_end_clientX = null; // 鼠标释放长度
	}
	// 初始化
	init() {
		this.createDom()
	}
	/*
	 *	设置图片样式
	 *	@img_list {Array}
	 * 
	 */
	setImgList(img_list) {
		this.img_list = img_list
	}
	/*
	 *	设置容器样式
	 *	@params {Object}
	 * 
	 *	容器组成，宽度，高度，定位，3D模式
	 */
	setContainerStyle(params) {
		let container = document.querySelectorAll('.' + this.class_name)[0]
		Object.assign(container.style, params)
	}
	/*
	 *	创建容器
	 *	容器默认样式 宽度 100%，高度 270px，定位 relative，背景 black，变换样式 3D
	 * 
	 */
	createDom() {
		let container = document.querySelectorAll('.' + this.class_name)[0]
		Object.assign(container.style, {
			width: '100%',
			height: '270px',
			position: 'relative',
			overflow: 'hidden',
			transformStyle: 'preserve-3d',
			backgroundColor: 'black'
		})
		let fragment = document.createDocumentFragment()
		let ul = document.createElement('ul');
		Object.assign(ul.style, {
			width: '1000px',
			height: '100%',
			margin: '0 auto',
			marginTop: '10px',
			position: 'relative'
		})
		for (let i = 0; i < this.img_list.length; i++) {
			let li = document.createElement('li')
			li.className = 'li' + (i + 1)
			this.li_list[i] = li
			this.li_list[i].addEventListener("mousedown", this.mousedownHandler.bind(this))
			this.li_list[i].addEventListener("mouseup", this.mouseupHandler.bind(this))
			this.li_obj[i] = {
				["li" + i] : this.li_list[i],
				current: i,
				next: i+1 === this.li_list.length ? 0 : i + 1,
				last: i-1 < 0 ? this.li_list.length - 1 : i - 1,
				zIndex: getComputedStyle(this.li_list[i])["zIndex"]
			}
			ul.appendChild(li)
		}
		fragment.appendChild(ul)
		container.appendChild(fragment)
	}
	mousedownHandler(e) {
		this.mousedown_start_clientX = e.clientX
	}
	mouseupHandler(e) {
		this.mouseup_end_clientX = e.clientX
		if (this.mousedown_start_clientX > this.mouseup_end_clientX) {
			this.rightClickHandler()
		} else if (this.mousedown_start_clientX < this.mouseup_end_clientX) {
			this.leftClickHandler()
		} else if (this.mousedown_start_clientX === this.mouseup_end_clientX) {
			this.autoCarousel()
		}
	}
	/*
	 *	右点击按钮
	 */
	rightClickHandler() {
		for (let i in this.li_obj) {
			this.li_obj[i].current = this.li_obj[i].current - 1 < 0 ? this.li_list.length - 1 : this.li_obj[i].current - 1;
			this.li_obj[i].zIndex = this.zIndex[this.li_obj[i].current]
			Object.assign(this.li_obj[i]["li" + i].style, {
				transform: "translateX(" + this.translateX[this.li_obj[i].current] + "px) scale(" + this.scale[this.li_obj[i].current] + ")",
				transitionDuration: "300ms",
				zIndex: this.li_obj[i].zIndex
			})
		}
		this.autoCarousel()
	}
	/* 
	 *	左点击按钮
	 */
	leftClickHandler() {
		// clearInterval(this.key)
		for (let i in this.li_obj) {
			this.li_obj[i].current = this.li_obj[i].current + 1 > this.li_list.length - 1 ? 0 : this.li_obj[i].current + 1;
			this.li_obj[i].zIndex = this.zIndex[this.li_obj[i].current]
			Object.assign(this.li_obj[i]["li" + i].style, {
				transform: "translateX(" + this.translateX[this.li_obj[i].current] + "px) scale(" + this.scale[this.li_obj[i].current] + ")",
				transitionDuration: "300ms",
				zIndex: this.li_obj[i].zIndex
			})
		}
		this.autoCarousel()
	}
	/* 
	 *	自动轮播
	 */
	autoCarousel() {
		clearInterval(this.key)
		this.key = setInterval(() => {
			for(let i in this.li_obj) {
				this.li_obj[i].current = this.li_obj[i].current - 1 < 0 ? this.li_list.length - 1 : this.li_obj[i].current - 1;
				this.li_obj[i].zIndex = this.zIndex[this.li_obj[i].current]
				Object.assign(this.li_obj[i]["li" + i].style, {
					transform: "translateX(" + this.translateX[this.li_obj[i].current] + "px) scale(" + this.scale[this.li_obj[i].current] + ")",
					transitionDuration: "300ms",
					zIndex: this.li_obj[i].zIndex,
				})
			}
		}, 2000)
	}
}