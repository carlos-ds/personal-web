---
layout: layouts/article-layout.njk
title: "Add some Typescript love to your Material dialogs"
date: 2023-09-22
tags: ['article']
preview: "Get the maximum out of Material and Typescript by properly providing types and interfaces when opening Material dialogs."
description: "Get the maximum out of Material and Typescript by properly providing types and interfaces when opening Material dialogs."
containsCodeSnippet: true
---

# {{ title }}

On every (non-personal) Angular project I've worked on, [Material dialogs](https://material.angular.io/components/dialog/overview) were a given. It's a shame that we are often not providing them the type annotation love they need.

Let's assume we encounter the following code:

<pre>
<code class="language-ts">
export class ParentComponent {
  public constructor(private readonly dialog: MatDialog) {}
  
  public openConfirmDialog(): void {
    this.dialog.open(DialogComponent, {
      autoFocus: false,
      data: {
        id: 1
      }
    });
  }
}
</code>
</pre>

First, let's have another look at the signature for `dialog.open()`:

<pre>
<code class="language-ts">
open&lt;T, D = any, R = any&gt;(component: ComponentType&lt;T&gt;, config?: MatDialogConfig&lt;D&gt;): MatDialogRef&lt;T, R&gt;
</code>
</pre>

That raises two important issues which I've highlighted as comments below.

<pre>
<code class="language-ts">
export class ParentComponent {
  public constructor(private readonly dialog: MatDialog) {}

  public openConfirmDialog(): void {
    this.dialog.open(ConfirmComponent, {
      autoFocus: false,
      data: {
        /* If you don't provide the type or interface for the data to pass to the ConfirmComponent, 
        Typescript will infer data as any */
        id: 1
      }
    })
      .afterClosed()
      .subscribe(result => {
        /* If you don't provide the possible values with which the dialog will be closed inside ConfirmComponent,
        Typescript will infer result as any */
      });
  }
}
</code>
</pre>

## The solution: generics

How do we solve this? Easy enough! According to the signature, Typescript allows you to pass the types it so desperately needs as _generic type parameters_. That's because `.open()` is a generic method.

In case you need a refresher about generics, or you have no clue what I'm talking about, I found [this tutorial](https://ts.chibicode.com/generics) to be an excellent introduction.

Let's dive in:

<pre>
<code class="language-ts">
export class ParentComponent {
  public constructor(private readonly dialog: MatDialog) {}

  public open(): void {
    this.dialog.open&lt;DialogComponent, { id: number }, string&gt;(DialogComponent, {
      autoFocus: false,
      data: {
        /* The line below will throw a compile-time error 
        because Typescript expects a number for the 'id' property */
        id: '1'
      }
    })
      .afterClosed()
      /* The line below will throw a compile-time error 
      because the return type is defined as a string */
      .subscribe((result: number) => {
        // do something
      });
  }
}
</code>
</pre>

One of the main reasons why I always add the types, even though it's not mandatory, is because I once made a **typo** in a key of the data passed into a child component.
When I found out that you could simply provide a type or interface for that data, I could've banged my head against a brick wall.

Secondly, I learned by experience to always assume the result value of the dialog can be `undefined`.
There are 3 scenarios in which this occurs:

1. Close the dialog without the optional result value.
2. Close the dialog by clicking on the backdrop.
3. Close the dialog by pressing the <kbd>Escape</kbd> key.

While [there are ways](https://stackoverflow.com/questions/46849753/angular-material-dialog-return-value) to ensure that the result value will not be `undefined`,
the problem lies deeper: there is no way to infer the type of the result value coming from the child component.

## Can we do even better?

This missing link between the type of the dialog result value and the parent component poses a significant problem for type safety. While there has been a [feature request](https://github.com/angular/components/issues/24538) to resolve this, it unfortunately did not receive enough votes.
A solution will surely be hard-fought as you can not only define the result value by using it as an argument for `dialog.close()`, but you can also bind it to the `mat-dialog-close` attribute inside the template.
Regardless, I hope this will someday be reconsidered. 

Meanwhile, as I also posted on [Github](https://github.com/angular/components/issues/24538), an alternative approach can be found in [this blog post](https://www.pellegrims.dev/blog/ng-material-dialog-type-safety/). It involves creating an abstract class that your child component can extend from and a custom dialog service as follows:

<pre>
<code class="language-ts">
@Directive()
export abstract class StronglyTypedDialog&lt;DialogData, DialogResult&gt; {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef&lt;
      StronglyTypedDialog&lt;DialogData, DialogResult&gt;,
      DialogResult
    &gt;
  ) {}
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(public dialog: MatDialog) {}

  open = &lt;DialogData, DialogResult&gt;(
    component: ComponentType&lt;StronglyTypedDialog&lt;DialogData, DialogResult&gt;&gt;,
    config?: MatDialogConfig&lt;DialogData&gt;
  ): MatDialogRef&lt;
    StronglyTypedDialog&lt;DialogData, DialogResult&gt;,
    DialogResult
  &gt; => this.dialog.open(component, config);
}
</code>
</pre>

With this approach, we now need to define the result value type upfront. For example:

<pre>
<code class="language-ts">
export class DialogComponent extends StronglyTypedDialog&lt;DialogData, boolean&gt; {
  okClick = () => this.dialogRef.close(true);

  /* The line below will throw a compile-time error
  because the type of the result value is declared as a boolean */
  cancelClick = () => this.dialogRef.close('cancel');
}
</code>
</pre>

Our parent component can now infer the result value type based on the type of the child component.

<pre>
<code class="language-ts">
export class CheckoutComponent {
  public constructor(private readonly dialog: DialogService) {}

  public open(): void {
    this.dialog.open(DialogComponent, {data: {something: 'hello'}})
      .afterClosed()
      /* The line below will throw a compile-time error
      because the type of the result value is declared as a boolean in the child component */
      .subscribe((result: string | undefined) => {
        // do something
      });
  }
}
</code>
</pre>

However, one missing gap remains using the approach above: defining the result value in the template. Assume the following template for our `DialogComponent`:

<pre>
<code class="language-html">
&lt;!-- The line below will not throw a compile-time error as the value for the mat-dialog-close attribute is not type-checked --&gt;
&lt;button [mat-dialog-close]="hello"&gt;&lt;/button&gt;
</code>
</pre>

## Summary

We analyzed two approaches to increase type safety when opening and closing Material dialogs. 

Our **first approach** makes use of the **built-in generic type parameters**, but lacks a link between the result value type and the parent component.
In the **second approach**, we created our own **link between the result value type and the parent component**. But using the `mat-dialog-close` attribute in the template itself still poses a threat and the approach itself is more complex.








