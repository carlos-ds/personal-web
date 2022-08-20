---
layout: layouts/article-layout.njk
title: "Working with async validators in Angular"
date: 2022-08-01
tags: ['article']
preview: "Provide users with a better users experience by asynchronously validating their form input."
description: "Provide users with a better users experience by asynchronously validating their form input."
containsCodeSnippet: true
---

# {{ title }}

There are numerous occasions on which you'll found yourself needing to retrieve data from an external source, in order to validate user input. For example:

- Validate if the name of an object the user is trying to create does not already exist in the database.
- Retrieve boundary values based on the user's input.

The great thing is that this functionality is built right into Reactive Forms: **asynchronous validators**.

## About asynchronous validators

An asynchronous validator is just a **function which returns another function**. Simple as that. 

The function it returns takes a form control as an argument and returns a promise or observable of type `ValidationErrors`.
If there are no errors, the function returns a promise or observable of type `null`.

<pre>
<code class="language-javascript">
interface AsyncValidatorFn {
  (control: AbstractControl&lt;any, any&gt;): Promise&lt;ValidationErrors | null&gt; | Observable&lt;ValidationErrors | null&gt;
}
</code>
</pre>

Let's try to solve the first use case above. Assume we have a website which contains recipes, and users can enter a recipe themselves using a form. Every recipe has a title and a description. 

However, we don't want to allow users to add a recipe with a title of an already existing recipe. Why have the same recipe displayed twice, right?

This means we need to:

- Create a validator function. It will return another function which - on submit - calls an API endpoint with the recipe title, which returns a boolean indicating if the title of the recipe already exists.
- Register our validator function to make it listen for changes to the recipe title's value.
- Based on the response from the API, return a promise or observable containing the validation errors (if any).

## Create the validator function

Our validator function could look like this:

<pre>
<code class="language-javascript">
function recipeTitleAsyncValidator(recipeService: RECIPES): AsyncValidatorFn {
  return (control: AbstractControl) =&gt; Observable&lt;ValidationErrors | null&gt; {
    this.recipeService.isRecipeTitleInUse(control.value).pipe(
      map((result: {recipeTitleInUse: boolean}) =&gt; {
        return result.recipeTitleInUse ? ({recipeTitleInUse: true}) : null;
      })
    );
  }
}
</code>
</pre>

Notice how we're passing in the service which handles the API call as an argument to the function.

Moreover, you can see that we have also mapped the API response to an observable of value `{recipeTitleInUse: true}` (when the recipe name is already taken) or `null` (when it is not). This complies with the `ValidationErrors` type.

<pre>
<code class="language-javascript">
  type ValidationErrors = {
    [key: string]: any;
  };
</code>
</pre>

As you can see, the possible values in this object are not limited to boolean values. You could pass any other value and utilize it inside the component or template (e.g. showing in the error message how many items with a similar title already exist).

## Register our validator with the form control

There are 3 main methods to register an asynchronous validator. You can register it directly in the constructor of a FormControl:

<pre>
<code class="language-javascript">
const recipeForm = new FormGroup({
  title: new FormControl(null, Validators.required, recipeTitleAsyncValidator)
});
</code>
</pre>

As you can see, our asynchronous validator is the third argument in the constructor. The second argument is reserved for synchronous validators.

A second option is to use `FormBuilder`.

<pre>
<code class="language-javascript">
const recipeForm = this.formBuilder.group({
  title: [null, Validators.required, recipeTitleAsyncValidator(this.recipeService))
});
</code>
</pre>

I always prefer `FormBuilder` for large forms because the syntax is more or less the same, but it is a little less verbose.

The third and last option is the most verbose. Instead of setting the validators upon initialization of the form control, we add the validators afterwards.

This can be useful in cases where validation depends on one or multiple conditions. For example, if we only needed to validate the recipe title if the recipe is not added by an administrator.

<pre>
<code class="language-javascript">
const recipeForm = this.formBuilder.group({
  title: [null, Validators.required]
});

if (!isAdmin) {
  recipeForm.get('title').addAsyncValidators(recipeTitleAsyncValidator(this.recipeService));
  recipeForm.get('title').updateValueAndValidity();
}
</code>
</pre>

Easy to forget but we have to call `updateValueAndValidity` for the new validator(s) to take effect.

Note that we could refactor the example above using a ternary operator during the initialisation phase.

<pre>
<code class="language-javascript">
const recipeForm = this.formBuilder.group({
  title: [null, Validators.required, isAdmin ? null : recipeTitleAsyncValidator(this.recipeService))
});
</code>
</pre>

But in cases where the condition `isAdmin` would be fetched asynchronously, this won't work. If `isAdmin` changes, the validator will not suddenly be removed. That means there is definitely a use case for adding the validators after initialisation.

If validators can be added manually, can we remove them manually? Duh!

<pre>
<code class="language-javascript">
const recipeForm = this.formBuilder.group({
  title: [null, Validators.required]
});

if (isAdmin) {
  recipeForm.get('title').removeAsyncValidators(recipeTitleAsyncValidator(this.recipeService));
  recipeForm.get('title').updateValueAndValidity();
}
</code>
</pre>

Take a good look at the [Angular documentation for AbstractControl](https://angular.io/api/forms/AbstractControl) (the parent type of `FormGroup`, `FormControl` and `FormArray`) and you will find two other methods related to asynchronous validators:

- `clearAsyncValidators`: removes all asynchronous validators
- `setAsyncValidators`: overwrites all asynchronous validators with new validators

## Display the validation errors

To display the errors, we need to verify if the errors object of our form control contains a key `recipeTitleInUse`. A simple `ngIf` statement does the trick well.

To simplify the example, we use the [form field and error components from Material UI](https://material.angular.io/components/form-field/overview).

<pre>
<code class="language-html">
&lt;mat-form-field&gt;
  &lt;mat-label&gt;Title&lt;/mat-label&gt;
  &lt;input placeholder="Recipe title" type="text" [formControl]="title"&gt;
&lt;/mat-form-field&gt;
&lt;mat-error *ngIf="recipeForm.get('title').hasError('recipeTitleInUse')"&gt;
  This recipe name is already in use.
&lt;/mat-error&gt;
</code>
</pre>

This approach is exactly the same for synchronous validators.

## Improving the validator

While testing the example above, you'll notice there is room for improvement. In certain cases, a validation call is executed but obsolete:

- If the input field is empty, because the title is a required field.
- If a change event is triggered, but the input value is the same as the previous value.
- If the input value changes multiple times in quick succession, because we only want the last value to be validated.

Let's see how we would tackle these issues:

<pre>
<code class="language-javascript">
function recipeTitleAsyncValidator(recipeService: RECIPES): AsyncValidatorFn {
  return (control: AbstractControl) =&gt; Observable&lt;ValidationErrors | null&gt; {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return null;
    } else {
      of(control.value).pipe(
        delay(1000),
        distinctUntilChanged(),
        switchMap((value: string) => this.recipeService.isRecipeTitleInUse(value)),
        map((result: {recipeTitleInUse: boolean}) =&gt; {
          return result.recipeTitleInUse ? ({recipeTitleInUse: true}) : null;
        })
      );
    }
  }
}
</code>
</pre>

**First of all**, we're returning `null` when the input value is empty. Why? Because the `Validators.required` validator takes care of invalidating the input when it is empty.

**Second**, we're adding a delay of 1 second before executing the HTTP call. If a new value comes in during this delay, the validation will be cancelled and a new validation will start with the updated values.

You could argue that `debounceTime` should be the RxJS operator of choice here. But the thing is, the asynchronous validator sort of debounces this for us. Behind the scenes, it performs a new validation every time the input changes, and at the same time cancels the previous subscription (or rejects the previous promise).

**Finally**, we added the `distinctUntilChanged` operator, in order to prevent executing an HTTP call if the previous value is equal to the current value. This can for instance occur when the user pastes the same value into the input field, or when the user types a new value but, within the delay of 1000 ms, changes it back to the old value.

## Testing our asynchronous validator

We've verified that our asynchronous validator works and have improved it. As a final step, how can we write a unit test for this?

Basically, we create a new `FormControl`, patch the value and check if the `errors` object contains the expected values.

<pre>
<code class="language-javascript">
import ...

describe('recipeTitleAsyncValidator', () => {
  let recipeService: RECIPES;
  let validator: AsyncValidatorFn;
  let recipeTitleFormControl: FormControl;

  beforeEach(
    waitForAsync(() =&gt; {
      TestBed.configureTestingModule({
        imports: [],
        providers: [{provide: RECIPES, useClass: RecipeService}],
        declarations: []
      });
    })
  );

  beforeEach(() =&gt; {
    recipeService = TestBed.inject(RECIPES);
    validator = recipeTitleAsyncValidator(recipeService);
    recipeTitleFormControl = new FormBuilder().control('', [], validator);
  });

  describe('if recipe title is in use', () =&gt; {
    it('should return a recipeTitleInUse error', fakeAsync(() =&gt; {
      spyOn(recipeService, 'isRecipeTitleInUse').and.returnValue(of({recipeTitleInUse: true}));
      recipeTitleFormControl.patchValue('Lasagna Bolognese');

      tick(500);

      expect(recipeTitleFormControl.hasError('recipeTitleInUse')).toBeTrue();
    }));
  });
});
</code>
</pre>

In short:

- We create a spy for the `recipeService` method which we are calling.
- We create a new form control, register the validator and update the value with the recipe title.
- Wrapping the test in `fakeAsync` allows us to _test asynchronous code in a synchronous way_. We can manipulate time as `tick(500)` will virtually advance time for 500 ms, which is (not coincidentally) the duration of the delay we introduced before executing the HTTP call.
- To wrap it up, we assert that our form control has the expected error (if the title is already in use) or not (if it is still available).

And with that, we can also **wrap up this post**! I hope you enjoyed it and let me share some of the sources if you're hoping to learn even more:

- Angular documentation: [AsyncValidatorFn](https://angular.io/api/forms/AsyncValidatorFn), [fakeAsync](https://angular.io/api/core/testing/fakeAsync), [FormBuilder](https://angular.io/api/forms/FormBuilder)
- Jasmine documentation: [spyOn](https://jasmine.github.io/api/edge/global.html#spyOn)
- [Testing Asynchronous Code in Angular Using FakeAsync](https://netbasal.com/testing-asynchronous-code-in-angular-using-fakeasync-fc777f86ed13)
- [Angular Async Validator Example](https://www.tektutorialshub.com/angular/angular-async-validator-example/)