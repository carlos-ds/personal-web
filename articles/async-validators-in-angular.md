---
layout: layouts/article-layout.njk
title: "Working with async validators in Angular"
date: 2022-08-01
tags: ['article']
preview: "I'm taking a break from writing. And here's why."
description: "I'm taking a break from writing. And here's why."
containsCodeSnippet: true
---

# {{ title }}

There are numerous occasions on which you'll found yourself needing to retrieve data from an external source, in order to validate user input. For example:

- Validate if the name of an object the user is trying to create does not already exist in the database.
- Retrieve calculated boundary values based on the user's input.

The great thing about Angular is that this functionality is built right into Reactive Forms: **asynchronous validators**.

## About asynchronous validators

An asynchronous validator is just a **function which returns another function**. Simple as that. 

The function it returns takes a form control as an argument and returns a Promise or observable of type <code class="inline-code">ValidationErrors</code>.
If there are no errors, the function returns a promise or observable of type <code class="inline-code">null</code>.

<pre>
<code class="language-javascript">
interface AsyncValidatorFn {
  (control: AbstractControl&lt;any, any&gt;): Promise&lt;ValidationErrors | null&gt; | Observable&lt;ValidationErrors | null&gt;
}
</code>
</pre>

Let's try to implement this using the first example above. Assume we have a form which is used to save recipes. Every recipe has a title and a description. 

However, we don't want to allow users to add a recipe with a title of an already existing recipe. Why have the same recipes twice, right?

This means we need to:

- Create a validator function. It will return another function which calls an API endpoint, returning a boolean indicating if the name of the recipe already exists.
- Register our validator function to make it listen for changes to the recipe name's value.
- Based on the response from the API, return a promise or observable containing the validation errors (if any).

## Create the validator function

Let's have a look at what the function could look like:

<pre>
<code class="language-javascript">
function recipeTitleAsyncValidator(control: AbstractControl, recipeService: RECIPES): AsyncValidatorFn {
  return (control: AbstractControl) =&gt; Observable&lt;ValidationErrors | null&gt; {
    this.recipeService.doesRecipeTitleAlreadyExist(control.value).pipe(
      map((result: {recipeNameInUse: boolean}) =&gt; {
        return result.recipeNameInUse ? ({recipeNameInUse: true}) : null;
      })
    );
  }
}
</code>
</pre>

Notice how we're passing in the service which handles the API call as an argument to the function. That way, we can inject the service into the component's constructor like we normally would.

Moreover, you can see that we have also mapped the API response to an observable of value <code class="inline-code">{recipeNameInUse: true}</code> (when the recipe name is already taken) or <code class="inline-code">null</code> (when it is not). 

This first type complies with the <code class="inline-code">ValidationErrors</code> type:

<pre>
<code class="language-javascript">
  type ValidationErrors = {
    [key: string]: any;
  };
</code>
</pre>

As you can see, the values in this object are not limited to boolean values. You could pass any other value and utilize it inside the component or template (e.g. showing in the error message how many items with a similar title already exist).

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

A second option is to use <code class="inline-code">FormBuilder</code>.

<pre>
<code class="language-javascript">
const recipeForm = this.formBuilder.group({
  title: [null, Validators.required, recipeTitleAsyncValidator(this.recipeService))
});
</code>
</pre>

I always prefer <code class="inline-code">FormBuilder</code> for large forms because the syntax is more or less the same, but it is a little less verbose.

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

Easy to forget but we have to call updateValueAndValidity for the new validator(s) to take effect.

Note that we could refactor the example above using a ternary operator during the initialisation phase.

<pre>
<code class="language-javascript">
const recipeForm = this.formBuilder.group({
  title: [null, Validators.required, isAdmin ? null : recipeTitleAsyncValidator(this.recipeService))
});
</code>
</pre>

But in cases where the condition isAdmin would be fetched asynchronously, this won't work. If the value of isAdmin changes, the validator will not suddenly be removed. That means there is definitely a use case for adding the validators after initialisation.

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

If you have a good look at the Angular documentation, you will find two other methods related to asynchronous validators:

- clearAsyncValidators(): removes all validators for a given FormControl
- setAsyncValidators(A)

## Display the validation errors

To display the errors, we need to verify if the errors object of our form control contains a key <code class="inline-code">recipeNameInUse</code>. A simple <code class="inline-code">ngIf</code> statement does the trick well.

To simplify the example, we use the [form field and error components from Material UI](https://material.angular.io/components/form-field/overview).

<pre>
<code class="language-html">
&lt;mat-form-field&gt;
  &lt;mat-label&gt;Title&lt;/mat-label&gt;
  &lt;input placeholder="Recipe title" type="text" [formControl]="title"&gt;
&lt;/mat-form-field&gt;
&lt;mat-error *ngIf="recipeForm.get('title').hasError('recipeNameInUse')"&gt;
  This recipe name is already in use.
&lt;/mat-error&gt;
</code>
</pre>

This approach is exactly the same for synchronous validators.