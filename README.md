

参照:   
[https://github.com/banmunongtian/react-es6-webpack](https://github.com/banmunongtian/react-es6-webpack)

[http://www.cnblogs.com/penghuwan/p/6665140.html](http://www.cnblogs.com/penghuwan/p/6665140.html)

# 使用

```
git clone xxx

cd webpackstudy

npm install

npm start
```

# 基本的webpack文件

 1. `webpack.config.js` 配置文件。这个很有用，webpack默认会调用这个。如果你改名或移动位置（默认根目录下）,需要指定配置文件。

 2. `package.json` npm配置文件。通常使用 `npm init`初始化完成。在该配置文件中，可以配置一些webpack相关的命令。比如启动webpack或上边说到的指定配置文件。eg：

 ``` javascript
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack"
  },
 ```
3. 编译前文件。js，css，less，图片等等。

4. 编译输出文件夹。

# webpack.config.js

webpack.config.js 通常有下边四个方面，初步有个概念：  

1. **entry**  入口文件。

2. **output**  输出相关。比如路径，输出文件名。

3. **loader** 加载器。如 css-loader，style-loader。

4. **plugin** 插件。

官方介绍：[https://webpack.js.org/concepts/](https://webpack.js.org/concepts/)

官方配置：[https://webpack.js.org/configuration/](https://webpack.js.org/configuration/)

# 多页面项目构建

回归正题，多页面构建。欲实现这个，先得安装一个插件 **html-webpack-plugin**

```
npm install --save-dev html-webpack-plugin
```
然后，根据实际情况配置，这里有一个基础配置。

**webpack.config.js**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const config = {
    entry: {
        ab: __dirname + '/src/ab.js',
        cd: __dirname + '/src/cd.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-[hash].bundle.js',
    },
    module: {
        rules: [
            {test: /\.txt$/, use: 'raw-loader'},
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'ab.html',
            template: './index.html',
            chunks: ['ab'],
        }),

        new HtmlWebpackPlugin({
            filename: 'cd.html',
            template: './index.html',
            chunks: ['cd'],
        }),
    ],
}
module.exports = config
```

> entry 入口可以是一个字符串（唯一入口）对象。也可以是一个object对象。当然object对象如果只有一条配置。也是唯一一个入口。  

> output 输出通常配置两个选项。一个path（输出文件路径）和filename（文件名）。而文件名这里，有讲究。这里使用了两个占位符**name**和**hash**，分别对应入口文件的配置的**key**和打包时的**hash**值。这样保证打包生成文件的唯一性。

> module 中，会包含一些loader。

> plugins 这个是多页面打包的关键。plugins是一个数组，可以包含很多很多插件。使用什么插件，先**install**，然后**require**进来，再**new**,配置在plugins中就可以。这里分别对两个入口文件打包，打包后的文件也分别在输出目录中。
这里需要注意**html-webpack-plugin**的配置。 filename 输出的文件名。template 源文件，输出文件以源文件为基础添加js的。 chunks,对应入口的key。

更详细，请参考：[http://www.cnblogs.com/penghuwan/p/6665140.html](http://www.cnblogs.com/penghuwan/p/6665140.html)

# 清除打包的文件

如上边这样设置，每次修改文件，然后打包。**dist** 文件夹下的文件就会越来越多。而那些文件又不需要这个时候可以用 **clean-webpack-plugin** 来删除。

外来插件，都需要先下载。

```
npm install --save-dev clean-webpack-plugin
```

然后，在插件中添加设置。

clean-webpack-plugin的参数：

(Array param1, Object param2)

> param1 配置需要删除的文件或目录  

> param2 配置选项。常用的有：  
root: "/dist/" //根目录 （这里也可以是array，很灵活）   
verbose：true, //是否写日志  
dry：false, // 是否真要删除  
exclude：['xx', 'xxx'] //排除不删除的目录或文件

最后配置如下：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ClearWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const config = {
    entry: {
        ab: __dirname + '/src/ab.js',
        cd: __dirname + '/src/cd.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-[hash].bundle.js',
    },
    module: {
        rules: [
            {test: /\.txt$/, use: 'raw-loader'},
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'ab.html',
            template: './index.html',
            chunks: ['ab'],
        }),

        new HtmlWebpackPlugin({
            filename: 'cd.html',
            template: './index.html',
            chunks: ['cd'],
        }),
    ],
}
module.exports = config

module.exports.plugins = (module.exports.plugins || []).concat([
    // 构建之前，先删除dist目录下面的文件夹
    new ClearWebpackPlugin(['dist']),
])

```

# 分离css，单独打包

通过插件 **extract-text-webpack-plugin** 可以方便的实现css单独打包。
> 插件官网：[https://github.com/webpack-contrib/extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)  
参考： [http://www.cnblogs.com/dyx-wx/p/6529447.html](http://www.cnblogs.com/dyx-wx/p/6529447.html)

先编写一个简单的css样式。文件位置， `/src/style/common.css`。

```css
html,body{
	padding:0;
	margin: 0;
}

span{
	display: block;
	width: 250px;
	margin-top: 20px;
	border: 1px solid #f06bd4;
	border-radius: 4px;
	padding: 3px 6px;
	font-size: 13px;
}

#t1{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

#t2{
	height: 68px;
}

#container{
	margin:100px;
}
```

安装 **extract-text-webpack-plugin** 以及 **css-loader** 和 **style-loader**

```
npm install --save-dev extract-text-webpack-plugin
npm install --save-dev css-loader
npm install --save-dev style-loader
```

修改 **webpack.config.js**

先引入 **extract-text-webpack-plugin**

``` javascript
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
```

这里需要注意三个地方。
1. 在output中定义输出css的路径。用 **/** 绝对路径和 **./** 相对路径。
2. 在module中编写 **rules**。
3. 在plugins中new插件。

完整的配置如下。

``` javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ClearWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const config = {
    entry: {
        ab: __dirname + '/src/ab.js',
        cd: __dirname + '/src/cd.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-[hash].bundle.js',
        publicPath: './',
    },
    module: {
        rules: [
            {test: /\.txt$/, use: 'raw-loader'},
            {
                test: /\.css$/, use: ExtractTextWebpackPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader',
            }),
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'ab.html',
            template: './index.html',
            chunks: ['ab'],
        }),

        new HtmlWebpackPlugin({
            filename: 'cd.html',
            template: './index.html',
            chunks: ['cd'],
        }),

        new ExtractTextWebpackPlugin('style/common.css'),
    ],
}
module.exports = config

module.exports.plugins = (module.exports.plugins || []).concat([
    // 构建之前，先删除dist目录下面的文件夹
    new ClearWebpackPlugin(['dist']),
])
```

上边说的注意的三个地方，配置这里再重复一下。

publicPath:用来覆盖项目路径,生成该css文件的文件路径。
use:指需要什么样的loader去编译文件,这里由于源文件是.css，所以选择css-loader。
fallback:编译后用什么loader来提取css文件。这里使用style-loader。
extract-text-webpack-plugin里边的参数用来设置css保存的文件位置和文件名。文件位置结合publicPath。

# 额外

[http://www.jqhtml.com/6393.html](http://www.jqhtml.com/6393.html)




























































































































>>>>>>> .theirs
