# YamYam-jmpress

Compiles a [YamYam markdown](https://github.com/sokra/YamYam) file to a presentation while using a [jade](https://github.com/visionmedia/jade) template for styling.

The predefined templates come with full featured and configured jmpress.js. It also have print support (press Esc and print it with firefox) to convert a presentation to pdf.

## Compile

1. `npm install` to install dependencies.

2.a. `node .` to compile all files in `src/`.

2.b. `node watch` to compile all files in `src/` and recompile if they are changed.

The results are written into the `out/` folder.

## Templates

The templates are in the `templates/` folder.

I recommend to create your own template with own style by copying the basic template and modifing it.

## Annotations

```
[@output template="<template-name>" output="<output-file-name>"]
```

Specify a template and target. You can specify multiple `@output`.

```
[@settings <name>="<value>" <name2>="<value2>"]
```

Set settings. Settings can be accessed in template by the `settings` object. (jade: `#{settings.title}`)

```
[<page-template>]
```

Starts a page with the template `<page-template>`.

## Documentation

See more documentation in [presentation](http://sokra.github.com/YamYam-jmpress/out/example.html).

