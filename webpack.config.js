const path = require('path'); // node packages path, we have to include this to join current absolute path
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./src/js/index.js'], // from where does the webpack start looking for to bundle
    output:{ // where to save the bundle
        path: path.resolve(__dirname,'dist'),
        filename:'js/bundle.js'

    },
    devServer:{
        contentBase: './dist'
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader'
                }
            }
        ]
    }

};