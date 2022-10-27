class Paginator{

	/** @type {HTMLElement} */
	container;

	/** @type {HTMLElement} */
	#dom;
	#currentPage = 1;
	#maxPages = 1;
	#prevButtonClickEvents = [];
	#nextButtonClickEvents = [];
	#formSubmittedEvents = [];

	/**
	 * @param {HTMLElement} container
	 */
	constructor(container) {
		this.container = container;
		this.#dom = this.#getDOM();
		this.container.append(this.#dom);
	}

	#firePrevButtonClickEvents(){
		for (const callback of this.#prevButtonClickEvents){
			callback(this.#currentPage);
		}
	}

	#fireNextButtonClickEvents(){
		for (const callback of this.#nextButtonClickEvents){
			callback(this.#currentPage);
		}
	}

	#fireFormSubmittedEvents(){
		for (const callback of this.#formSubmittedEvents){
			callback(this.#currentPage);
		}
	}

	/**
	 * When the previous page button is clicked. Callback will be fired with the new page number
	 * as an argument.
	 * @param {function} callback
	 */
	onPrevButtonClicked(callback){
		this.#prevButtonClickEvents.push(callback);
	}

	/**
	 * When the next page button is clicked. Callback will be fired with the new page number
	 * as an argument.
	 * @param {function} callback
	 */
	onNextButtonClicked(callback){
		this.#nextButtonClickEvents.push(callback);
	}

	/**
	 * When the input field for the page number is submitted. Callback will be fired with the new page number
	 * as an argument.
	 * @param {function} callback
	 */
	onPageNumberFormSubmitted(callback){
		this.#formSubmittedEvents.push(callback);
	}

	/**
	 * Sets the current page on this Paginator. Updates the form value as well. Does not re-submit the form.
	 * @param {int} currentPage
	 */
	setCurrentPage(currentPage){
		this.#currentPage = currentPage;
		this.#dom.querySelector(".js-paginator-page-number-input").value = String(currentPage);
	}

	/**
	 * Sets the maximum pages on this Paginator. Will update the textual display in the HTML component as well. If the new max pages is greater than the current page - setCurrentPage(maxPages) will be called by this method as well to clamp the current page to the maximum pages.
	 * @param {int} maxPages
	 */
	setMaxPages(maxPages){
		this.#maxPages = maxPages;
		this.#dom.querySelector(".js-paginator-max-pages").textContent = String(maxPages);

		if (this.#maxPages < this.#currentPage){
			this.setCurrentPage(maxPages);
		}
	}

	#getDOM(){
		const template = document.createElement("div");
		template.classList.add("js-paginator");
		template.innerHTML = `
			<div>
				<button type="button" class="paginator-button prev-button btn btn-outline-primary">
					<i class="bi bi-chevron-left"></i>
					<span>Prev</span>
				</button>
			</div>
			<div class="js-paginator-form-container">
				<form class="js-paginator-form">
					<input name="page-number" type="number" class="js-paginator-page-number-input form-control" value="1">
				</form>
				<div>
					<span class="mx-1">of</span> <span class="js-paginator-max-pages">1</span>
				</div>
			</div>
			<div>
				<button type="button" class="paginator-button next-button btn btn-outline-primary">
					<span>Next</span>
					<i class="bi bi-chevron-right"></i>
				</button>
			</div>
		`;

		const prevButton = template.querySelector(".prev-button");
		const pageNumberForm = template.querySelector(".js-paginator-form");
		const nextButton = template.querySelector(".next-button");

		prevButton.addEventListener("click", () => {
			if (this.#currentPage > 1){
				--this.#currentPage;
				this.setCurrentPage(this.#currentPage);
				this.#firePrevButtonClickEvents();
			}
		});

		nextButton.addEventListener("click", () => {
			if (this.#currentPage < this.#maxPages){
				++this.#currentPage;
				this.setCurrentPage(this.#currentPage);
				this.#fireNextButtonClickEvents();
			}
		});

		pageNumberForm.addEventListener("submit", e => {
			e.preventDefault();
			const fData = new FormData(pageNumberForm);
			const newPageNumber = parseInt(String(fData.get("page-number")));
			if (newPageNumber <= this.#maxPages && newPageNumber > 0){
				this.#currentPage = newPageNumber;
				this.setCurrentPage(this.#currentPage);
				this.#fireFormSubmittedEvents();
			}
		});

		return template;
	}
}

export default Paginator;