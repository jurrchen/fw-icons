module.exports = {
  jsx: {
    babelConfig: {
      plugins: [
        [
          '@svgr/babel-plugin-add-jsx-attribute',
          {
            elements: ['path'],
            attributes: [
              {
                name: 'vectorEffect',
                value: 'non-scaling-stroke',
              },
            ],
          },
          'path',
        ],
        [
          '@svgr/babel-plugin-add-jsx-attribute',
          {
            elements: ['svg'],
            attributes: [
              {
                name: 'overflow',
                value: 'visible',
              },
            ],
          },
          'svg',
        ],
      ],
    },
  },
}
