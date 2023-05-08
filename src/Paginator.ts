export default class Paginator {

	public container: HTMLElement;

	/** @type {HTMLElement} */
	private _dom: HTMLElement;
	private _currentPage: number = 1;
	private _maxPages: number = 1;
	private _prevButtonClickEvents: ((page: number) => void)[] = [];
	private _nextButtonClickEvents: ((page: number) => void)[] = [];
	private _formSubmittedEvents: ((page: number) => void)[] = [];

	constructor(container: HTMLElement) {
		this.container = container;
		this._dom = this.GetDOM();
		this.container.append(this._dom);
	}

	private FirePrevButtonClickEvents(): void {
		for (const callback of this._prevButtonClickEvents) {
			callback(this._currentPage);
		}
	}

	private FireNextButtonClickEvents(): void {
		for (const callback of this._nextButtonClickEvents) {
			callback(this._currentPage);
		}
	}

	private FireFormSubmittedEvents(): void {
		for (const callback of this._formSubmittedEvents) {
			callback(this._currentPage);
		}
	}

	/**
	 * When the previous page button is clicked. Callback will be fired with the new page number
	 * as an argument.
	 */
	public OnPrevButtonClicked(callback: (page: number) => {}): void {
		this._prevButtonClickEvents.push(callback);
	}

	/**
	 * When the next page button is clicked. Callback will be fired with the new page number
	 * as an argument.
	 */
	public OnNextButtonClicked(callback: (page: number) => {}): void {
		this._nextButtonClickEvents.push(callback);
	}

	/**
	 * When the input field for the page number is submitted. Callback will be fired with the new page number
	 * as an argument.
	 */
	public OnPageNumberFormSubmitted(callback: (page: number) => {}): void {
		this._formSubmittedEvents.push(callback);
	}

	/**
	 * Sets the current page on this Paginator. Updates the form value as well. Does not re-submit the form.
	 */
	public SetCurrentPage(currentPage: number): void {
		this._currentPage = currentPage;
		(this._dom.querySelector(".js-paginator-page-number-input") as HTMLInputElement).value = String(currentPage);
	}

	/**
	 * Sets the maximum pages on this Paginator. Will update the textual display in the HTML component as well. If the new max pages is greater than the current page - setCurrentPage(maxPages) will be called by this method as well to clamp the current page to the maximum pages.
	 */
	public SetMaxPages(maxPages: number): void {
		this._maxPages = maxPages;
		this._dom.querySelector(".js-paginator-max-pages").textContent = String(maxPages);

		if (this._maxPages < this._currentPage) {
			this.SetCurrentPage(maxPages);
		}
	}

	private GetDOM(): HTMLDivElement {
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

		const prevButton: HTMLButtonElement = template.querySelector(".prev-button");
		const pageNumberForm: HTMLFormElement = template.querySelector(".js-paginator-form");
		const nextButton: HTMLButtonElement = template.querySelector(".next-button");

		prevButton.addEventListener("click", () => {
			if (this._currentPage > 1) {
				--this._currentPage;
				this.SetCurrentPage(this._currentPage);
				this.FirePrevButtonClickEvents();
			}
		});

		nextButton.addEventListener("click", () => {
			if (this._currentPage < this._maxPages) {
				++this._currentPage;
				this.SetCurrentPage(this._currentPage);
				this.FireNextButtonClickEvents();
			}
		});

		pageNumberForm.addEventListener("submit", e => {
			e.preventDefault();
			const fData = new FormData(pageNumberForm);
			const newPageNumber = parseInt(String(fData.get("page-number")));
			if (newPageNumber <= this._maxPages && newPageNumber > 0) {
				this._currentPage = newPageNumber;
				this.SetCurrentPage(this._currentPage);
				this.FireFormSubmittedEvents();
			}
		});

		return template;
	}
}
