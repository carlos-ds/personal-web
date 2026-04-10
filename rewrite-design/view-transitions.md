How to implement view transitions on a multi-page application cf. https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using

## Step 1

On both current (old) and destination (new) document, opt in to view transitions:

```
@view-transition {
    navigation: auto;
}
```

## Step 2

Capture snapshots of elements that are part of the transition

```
h2.post-title {
    view-transition-name: post-title;
}
```
