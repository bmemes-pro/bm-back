import configuration from '../config'

const prodSigns = [
  '// (= ФェФ=)/ blockchain memes protocol',
  '// ⊂(◉‿◉)つ blockchain memes protocol',
  '// (ㆆ _ㆆ)/ blockchain memes protocol',
  '// ʕっ•ᴥ•ʔっ blockchain memes protocol',
  '// ( 0 _0)/ blockchain memes protocol',
  '// ( . Y.)/ blockchain memes protocol',
  '// (^o^)/ blockchain memes protocol',
  '// (⌐■_■)/ blockchain memes protocol'
]

const stagingSigns = [
  '// <|> bmp test',
  '// (.)(_) bmp test'
]

//const signsForProd = configuration.cluster === 'prod' || configuration.cluster === 'prod2'

export const DEFAULT_TAGS = ['blockchain', 'memes']
export const BMP_SIGNS = prodSigns
