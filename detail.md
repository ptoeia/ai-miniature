
昨晚我们期盼了很久的图像编辑模型终于上线了，大家不再需要从竞技场吭哧瘪肚抽卡，可以爽玩，而且谷歌一如既往的发挥了财大气粗的优势，可以让你疯狂白嫖。

在做了一晚上的通宵测试之后，发现这玩意真的很离谱。直接把 Adobe 和一众修图软件整麻了。

以往复杂的修图操作现在都可以一句话搞定，而且人脸的相似度相对于 FLUX Kontext 高了一截。

不多逼逼，先来总结一下这期教学内容：

用 Nano Banana 帮你修图：祛痘、瘦身、瘦脸、都不在话下
烂片拯救者，用 Nano Banana 一键让你的普通照片变大片
用简洁高效的方式展示你的今日穿搭
当然也可以快速让你的照片穿上别人整理的穿搭
通过标记、框选、涂鸦等方式辅助提示词更加精准的生成图片
充分利用 Nano Banana 的世界知识制作视频特效
根据主角图片一键生成连续的电影分镜
将你喜欢的照片或者物品变成实体贴纸送给朋友


如何使用 Nano Banana 
首先来看一下如何使用 Nano Banana ，优先推荐在谷歌的 AI Studio （https://aistudio.google.com/）上使用，因为免费而且不会掺水。

进入页面后，我们在页面最右侧将模型切换到 Gemini 2.5 Flash Image Preview 这个模型，没错这就是 Nano Banana的官方名称。

Image
切换模型之后就可以在输入框输入图片修改的需求，同时上传你需要修改的图片，这里支持多张图片的上传，之后点击 Run 按钮等待结果就行。

Image
当然 Nano Banana 也支持连续进行图片编辑，这里需要注意的是，连续的编辑四五次以后，就可能因为上下文超出而效果变差，这时候建议新建窗口重新开始。

Image
除了 AI Studio 以外，一部分 Gemini APP 的用户也可以用 Nano Banana 了，如果你可以用的时候会收到一个类似的弹窗，切换 Gemini 2.5 Flash 模型然后选择图片就行。

Image
我们熟知的一些 API 服务商和聚合图像视频产品比如 FAL 和 Krea 也都已经上线了 Nano Banana，你也可以在他们那里用，注意不要直接搜索 Nano Banana 官网，没有这种东西，你看到的全是骗子网站。



使用 Nano Banana 修图
大家现在都喜欢拍照，觉得自己拍的照片不好看？不会调色？有无关的东西？交给 NanoBanana 一段提示词解决。

把你的废片发给他，然后用我的提示词就可以一键把你的普通照片修成大片。

This photo is very boring and plain. Enhance it! Increase the contrast, boost the colors, and improve the lighting to make it richer,You can crop and delete details that affect the composition.
Image
Image
Nano Banana 这次升级以后人脸 ID 的一致性得到了大幅增强，如果你只是小幅修改图片的话，相似度非常高。

这样的话我们就可以直接用自然语言进行修图了，比如让藏师傅的脸变瘦，可以发现我面部的一些瑕疵也被修复了，所以你也可以直接让 Nano Banana 帮你修复肤质问题。

Make the character's face in the image slimmer, while increasing the muscle mass of the arms.
Image


Nano Banana 帮你展示穿搭和尝试新穿搭
今日 OOTD？直接让他展示平铺展示穿搭设计的所有商品。

A flat lay photograph showing all the clothing items involved in the photo.
Image


当然也可以反过来，用你的照片帮你尝试其他博主分享的穿搭，还原度非常好。

用提示词词的时候注意图片的顺序，我这里是用第一张第二张表示的。

The character in Figure 2 is wearing the clothing and accessories from Figure 1.
Image


通过涂鸦和标记控制图片的修改
由于本身 Nano Banana 的多模态理解和世界知识理解能力就很强，所以你不止可以通过文本提示词修改，也可以直接在需要修改的图片上做标记去修改。



我们先整个基础的用法，如果你有多张图片的话，你可以在图片上面做标记让模型更好的理解你的文本提示词。

比如我这里提示词就可以写让他用A图片的背景、B图片的沙发和相机角度、C图片的角色来完成三张图片的合成。

Using the environment from A, the sofa camera angle from B, and the subject from C, create a new image that combines these three elements.
Image


再进阶一点，你可以用方框或者圆圈标记修改图片需要替换的位置，比如我这里就让他把第二张图片的桌子和椅子放到了红框的位置。

可以看到这玩意确实是电商利器，图2里面椅子的细节、材质啥的都完美还原，但是光线表现和色彩风格却完美融入了图1.

Place the chair and table from the first image at the red box location in the second image, and generate the image without the red box markings.
Image


终极涂鸦控制这个非常离谱了，你可以直接给他两个正常姿势的角色和一个角色互动的涂鸦。

他就会帮你画出两个角色对应姿势的互动图像，这个对于动画制作和精准的动作控制帮助非常大。

Have these two characters fight using the pose from Figure 3.Add appropriate visual backgrounds and scene interactions,Generated image ratio is 16:9
Image
上面的是我跑的，随便画了一下姿势，如果你能够将草稿画的更加的细致的话 Nano Banana 的修改也会更精确。

比如这个 X 用户 minux302 的案例，连角色表情都还原了。

Image


当然我们还可以继续发散，相同角色+不同动作参考+连续编辑+可灵 2.1 首尾帧=高质量打斗动画。

这个有多强，我就不强调了，大家可以自己想象。



将你的照片变成可爱贴纸
昨天看到 Fenx 用 AI 圈子的流行梗做了一堆贴纸觉得很好玩，因为是开源的，我还去电商平台找店铺打印了几套。

昨晚 Nano Banana 发布后就试了一下看能不能基于他的设计参考生成，没想到真可以。

而且我问了一下贴纸打印只有 PNG 图片也可以，你完全可以做一套自己的然后找店铺打印送给朋友，应该会是不错的礼物。

Help me turn the character into a white outline sticker similar to Figure 2. The character needs to be transformed into a web illustration style, and add a playful white outline short phrase describing Figure 1.
Image


生成建筑或者物品讲解特效
谷歌说 Nano Banana 里面有 Gemini 的世界知识，所以你就可以在图片上增加一些物品的介绍或者描述。

比如这里我们就可以为世界知名建筑的图片加上对应的 AR 介绍卡片，比如这里的泰姬陵和悉尼歌剧院信息都是对的。

you are a location-based AR experience generator. highlight [point of interest] in this image and annotate relevant information about it.
Image
Image
获得图片之后我们用首尾帧视频模型处理一下就直接变成讲解动画特效了，这里我用的可灵 2.1，还能加上对应的讲解语音，一个完整的景点介绍分镜就搞好了。



电商图片修改
之前 FLUX Kontext 在电商修改的时候有个问题就是商品比例有问题，特别是首饰上这种问题很多，这里测试了一下 Nano Banana 会好非常多。

有时候他会改掉第二张图的细节比如发型，跟他说一下就行。

The woman in Figure 2 is wearing the necklace from Figure 1,Do not change the details of other Figure 2.
Image


古早动漫图和照片修复超分
老生长谈的图片修复和超分 Nano Banana 也表现的不错，比如我这里就修复了一下古早的《攻壳机动队》动画截图。

Enhance the resolution of this old anime image and add the appropriate texture details, reinterpreting it with modern anime techniques.
Image


好了这就是藏师傅这几天探索出来的 Nano Banana 全部的玩法和创意了。

当然之前我介绍的 FLUX Kontext 的玩法 Nano Banana 也全都支持，这里就不赘述了，感兴趣可以去看之前的文章《

对普通人最有用的一次！藏师傅教你用FLUX Kontext解决一切图片问题》



从现在开始所有需要“视觉表达”的生意，都值得用 Nano Banana 重做一遍。电商图片、本地生活、教育、婚庆、影视、印刷、旅游、媒体工具每个垂类和场景都有无数的需求等待满足。



希望藏师傅的内容能对你有所启发，感谢各位，希望帮忙点个赞👍或者喜欢🩷，也可以转发给你需要的朋友们。

Awesome Nano Banana！迄今最强生图模型的28个玩法合集 | 附提示词
Nano Banana 火的一塌糊涂，简单来说，这是迄今最强的文生图模型

如果你还记得 GPT4o 的生图能力有多令人震惊，现在，Nano Banana 的效果起码是它的 10 倍

核心特性在于「人物一致性」出奇的高，而这个特性是非常有商业落地价值的，例如电商、甚至是直接替代PhotoShop.

现在已经上线谷歌的Gemini 2.5Flash 模型，在这 https://aistudio.google.com/ 可免费用

Image
废话少说，饼干哥哥给大家整理了全网爆火的 20 种玩法，不妨都试一下，全面感受一下🍌带来的图像革命有多离谱。



电商场景
适合“上新/换装/场景化展示/统一风格”这类高频小改+批量产出的工作：少量指令即可完成换背景、换服饰、加道具、控手势拿物、产品一致性放置等，显著缩短精修链路。


1. 背景和服装替换
更改主体的环境和服装，同时保持原有的姿势和细节，用于文化或主题再想象。这种玩法对于虚拟试衣和快速生成不同风格的商品图尤为实用。
提示词：

Change the background to Marrakech and the clothes to a Moroccan Djellaba
Image
https://x.com/marouane53/status/1960349731512877416



类似的换衣服场景，通过自拍加服装网图，能一键直出多张上身效果图，还需要请模特吗？

Image
https://x.com/8co28/status/1960526924712960316


2. 人物换饰品
转换眼镜类型并添加互补物体如饮料，保留面部特征，适用于个性化肖像和产品展示。

提示词：

Make that computer glass to black sunglass with a healthy drink
Image
https://x.com/Star_Knight12/status/1960406677414666655


3. 单手持物/产品放置一致性
添加或重新定位产品在场景中，通过一只手臂或手部调整，确保无缝整合，用于电子商务视觉效果。
Let the woman hold this bag with one arm raised forward.
Image
https://x.com/HalimAlrasihi/status/1956368322414432295



4. 物品换配件
替换特定配件或物品，如手机壳，而不更改图像其余部分，适合快速产品变体，电商主图/AB 测试常用。
提示词：

change the iphone cover to this cover
Image
https://x.com/Salmaaboukarr/status/1960351687534661884



广告
主打多面板编排、品牌元素一致、从图到短视频的“素材工程化”。先用 Nano Banana 生成/改图，再衔接视频模型做动效延展。



5. 四宫格蒙太奇分镜（Multi-Panel Montage）
根据参考图像的风格，生成一组展示不同运动时刻的多面板蒙太奇图像，适用于制作风格统一的广告系列图。

Create a 4-panel montage showing sporting moments. Use the style of the reference image.
Image
https://x.com/ai_artworkgen/status/1958102908504780853



6. 带 logo 的广告短片
将品牌Logo无缝放置在由参考图衍生出的一系列连续场景中，以创建富有品牌故事性的广告内容。
提示词：

Original image from Ideogram.
Nano Banana to reimagine the logo in new places.
Runway Gen-4 Turbo to animate to video.
解释：先使用Ideogram等工具生成带Logo的原始图片，然后利用Nano Banana将其置于新场景，最后通过Runway Gen-4 Turbo等工具生成视频动画。

https://x.com/jerrod_lew/status/1960356192766542208



7. 单品拆解
从一张复杂的场景图中，精准识别并分离出各个独立的商品（如相机、耳机、鞋子等），并以陈列的方式展示，适用于制作产品目录或详细介绍图。

A man is standing in a modern electronic store analyzing a digital camera. He is wearing a watch. On the table in front of him are sunglasses, headphones on a stand, a shoe, a helmet and a sneaker, a white sneaker and a black sneaker
Image
https://x.com/MrDavids1/status/1960659805917331938



摄像
擅长机位切换、POV 视角、姿态重定向、拟单反质感等“摄影指令”。对短剧、B-roll、剧情海报极友好。



8. 高机位视图
从原图生成“高角度俯拍”的同场景版本。
Create a high-angle view of this shot
Image
https://x.com/TomLikesRobots/status/1960014126165733841



9. 第一人称 POV + 背景虚化
将摄像机角度切换到第一人称视角（POV），并根据需要模糊背景，以创造沉浸式的游戏或电影镜头感。
提示词：

swap the camera angle to a 1st person POV showing the head of the dragon from behind and blurred battleground on the background
Image
Image
https://x.com/techhalla/status/1958517274760851787



而同样的需求在 Midjourney要这么长

A wide cinematic low-angle shot of a monstrous winged beast flying above a dusty brown battlefield during the chaos of war | photorealistic details: skeletal wings stretched wide, leathery skin, elongated neck, glowing eyes and smoke rising from its jaws | a masked warrior clad in spiked black armor rides on its back, cloak torn and flowing in the wind, gripping chain-like reins | camera perspective from the ground looking up, capturing the terrifying silhouette against a fiery, dust-filled sky | battlefield below scattered with corpses, broken banners, burning weapons and thick clouds of smoke and ash | dramatic dusk lighting with cinematic fog, volumetric shadows and ominous fiery glow | shot on IMAX 70mm film



10. 微距摄影 (超真实昆虫)
生成具有极其丰富细节和逼真纹理的微距摄影作品。

提示词：

A hyper-realistic macro photograph of a bumblebee, covered in pollen, landing on a single, dew-covered petal of a purple iris. The background is a soft, out-of-focus garden.
Image
https://www.reddit.com/r/singularity/comments/1mpei4u/nanobanana_new_image_model_examples/





11. 分镜/B-roll 四帧序列
通过连续的指令，生成一个由多帧画面组成的视觉故事序列，用于构建电影世界或补充镜头。

提示词：

provide a 4-panel montage of b-roll footage of this subject, 16:9:

1. standing outside (back to the camera)
2. getting into the driver seat of a white sports car
3. getting into a matte gold horse-drawn chariot in the middle of the street
4. standing looking up towards the heavens with arms outstretched upwards (back to the camera)
Image
https://x.com/ai_artworkgen/status/1958490177090822264




12. 姿势调整 (重定向)
简单直接地改变图像中主体的姿势或注视方向。

I simply asked it to create a photo of someone looking straight ahead.
Image
https://x.com/arrakis_ai/status/1955901155726516652





13. DSLR 风格照片升级：低清照 → 拟单反质感
增强低质量照片以模仿高端相机拍摄，用于专业润色。
提示词：

Make this image look like a shot taken from [any top DSLR details]
https://x.com/HarshithLucky3/status/1960531361875591268



社媒
在社交媒体内容创作上，Nano Banana能够一键生成符合平台风格的网格图和吸引眼球的封面图，成为内容创作者的强大助手。


14. INS、小红书、朋友圈九宫格图
将一张核心图片嵌入到Instagram风格的九宫格中，并自动生成风格协调、内容互补的其余图片，非常适合内容策划和头脑风暴。
提示词：

put this on a social media instagram grid and add more images that works with the grid
Image
https://x.com/Salmaaboukarr/status/1960382811459748232





15. YouTube缩略图创作
根据指令，将人物照片与文字、背景元素结合，快速创作出风格夸张、引人注目的YouTube视频缩略图。

Create a YouTube thumbnail of this guy looking surprise with a tiny banana in his hand. The text should say "Nano Banana is WILD", modern style font
Image
Image
https://x.com/markgadala/status/1960370481543938380





动漫
覆盖连续分镜、停格动画质感、草图转动作、完整人设包等 AIGC 动漫工作流关键环节。



16. 连续漫画续集
在已有画风下“续写下一格/下一章”。
提示词很简单，没具体说

Try continue prompts in Gemini 2.5 Flash image generation (nano banana)
Image
Image
Image
Image
https://x.com/HarshithLucky3/status/1960379341981745223



17. 定格动画木偶风格
创造出手工制作的定格动画风格图像，具有丰富的毛毡、织物纹理和柔和的电影级光效。

提示词：

Ultra detailed stop-motion animation frame, two handmade toys interacting on a miniature set, felt and fabric textures, visible stitching, slightly imperfect shapes, soft cinematic lighting with gentle shadows, shallow depth of field, colorful handcrafted props, subtle dust and wear for realism, expressions made with sewn buttons and embroidered mouths, reminiscent of Coraline and Laika Studios style, whimsical and tactile atmosphere
Image
https://www.reddit.com/r/Bard/comments/1mr6ays/nanobanana_is_nearly_on_par_with_imagen_4_while/



18. 简笔画转人物动作
将简单的简笔画（火柴人）作为动作草图，结合指定的人物形象，生成具有相同动态的、细节丰富的动漫场景。

Image
https://x.com/yachimat_manga/status/1960471174758195494



19. 生成一套角色设定/故事书
从比例、三视图、表情、动作到服装，产出“可动用”的设定板。

提示词：

为我生成人物的角色设定（Character Design）
比例设定（不同身高对比、头身比等）
三视图（正面、侧面、背面）
表情设定（Expression Sheet） → 就是你发的那种图
动作设定（Pose Sheet） → 各种常见姿势
服装设定（Costume Design）
Image
https://x.com/ZHO_ZHO_ZHO/status/1960669234276753542



城市建筑
无论是科幻世界的概念艺术，还是现实世界的图像标注与建模，Nano Banana都能凭借其强大的图像理解和生成能力轻松应对。



20. 科幻景观概念图
渲染出一个细节极其丰富的、充满活力的外星世界景观。

A hyper-realistic sci-fi landscape of a vibrant alien planet with multiple moons in the sky. The ground is covered in bioluminescent flora, and a sleek, futuristic starship is landed in the foreground.
Image
https://www.reddit.com/r/singularity/comments/1mpei4u/nanobanana_new_image_model_examples/





21. 谷歌街景标识
由于 nano banca 拥有 gemini 的世界知识，您只需上传现实世界的屏幕截图并让它为您注释即可。

you are a location-based AR experience generator. highlight [point of interest] in this image and annotate relevant information about it.
Image
Image
Image
https://x.com/bilawalsidhu/status/1960529167742853378





22. 2d 图片转 3d 建模
将一张夜晚的建筑2D照片，转换为白天的、具有立体感的等距视图（Isometric）3D模型。

Make Image Daytime and Isometric (Building Only)
Image
Image
https://x.com/Zieeett/status/1960420874806247762





3D
聚焦3D 体素遮罩、部件上色、插画 → 手办可视化等“二维里做三维事”的创意玩法。



23. 3D 遮罩和部分特定编辑
在2D图像中遮罩3D体积，编辑姿势，并颜色编码变化，用于技术可视化。

提示词：

Mask the 3D volume of specific parts of this figure with a grid UI. Make her wave her right hand in the same pose, and mark those moved parts with an orange grid. The unchanged parts should be marked with a light-blue grid.
Image
Image
https://x.com/HbTteok/status/1957101835522904129



24. 插画变手办
将一个2D卡通插画角色，转化为一个逼真的3D角色手办，并根据详细指令生成包含手办包装盒、电脑建模过程以及室内场景的完整图像。

turn this photo into a character figure. Behind it, place a box with the character’s image printed on it, and a computer showing the Blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. set the scene indoors if possible
Image
https://x.com/ZHO_ZHO_ZHO/status/1958539464994959715





实用搞钱
Nano Banana的强大功能也催生了许多实用的商业变现思路，从照片修复到专业级精修，再到定制化商品制作，都展现出巨大的市场潜力。



25. 旧照片修复和增强
裁剪、修复损坏、上色并放大复古照片，用于档案或记忆复兴
提示词：

帮我处理一下这样照片，要求是：1. 只截取照片内容部分，移除桌面的背景、边框2. 修复照片里面的污损3. 把照片做成彩色的4. 高清放大照片
Image
https://x.com/passluo/status/1960549038425825581



26. 专业级照片精修
这哥们打算建一个修图网站，执行以往需要专业软件和大量手动操作的精修任务，例如在保留疤痕、痣等永久性标记的同时，去除皮肤上的痘痘、瑕疵，并平滑纹理，效果真实自然。

提示词：

Clean the face by removing acne, pimples, blemishes, and temporary spots from the skin (face, nose, forehead, neck, back of the head, throat). Smooth and correct the skin texture for a realistic and natural look. Preserve all permanent marks such as scars, moles, or birthmarks without altering them. 
中文释义：清洁面部，去除皮肤（脸、鼻子、前额、脖子、后脑、喉咙）上的粉刺、疙瘩、瑕疵和暂时性斑点。平滑并修正皮肤纹理，使其看起来真实自然。保留所有永久性标记，如疤痕、痣或胎记，不要改变它们。

Image
Image
https://www.reddit.com/r/GeminiAI/comments/1n1bxow/why_does_gemini_api_block_my_skin_retouching/





27. 3D模型赚钱思路
将人物照片转化为定制的3D玩具人偶模型并生成商品图，这种在GPT-4o时代就已存在的商业模式，可以无缝迁移到Nano Banana上，创造出更逼真、更具吸引力的个性化商品。

Image
https://x.com/AmbitiousXU/status/1959941388046684373



其他
28. 图片计数
模型能够准确计算图像中特定元素的数量，进行数学运算，并将运算结果以新元素的形式添加到图像中，可用于制作教育或解谜类视觉内容。
提示词：

Count the number of strawberries in this image than multiply that by two and add as many bananas at same size as the strawberries but put bananas on top of the strawberries for the new image.
Image
https://x.com/HarshithLucky3/status/1960379341981745223



Final：如何把 Nano Banana 真正用爽
工作流化：先写“规范化提示词模板”（如：主体不变 → 视角/姿态 → 局部修改 → 材质/光源 → 输出规格），把模板塞进 n8n等脚本里批量跑。
一致性不是“锁脸”：连续人物/品牌一致性“非常接近但非 100%”，要保留参考照/图素，必要时“多轮微调+对比”以稳定风格（社区已多次强调此点），参考：https://www.reddit.com/r/Bard/comments/1mvhhh1/nanobanana_is_amazing_but_it_does_not_produce/?utm_source=chatgpt.com
合规标记 & 风险提示：输出含 SynthID 暗水印，商用请留意平台规范与肖像/商标权。
与 GPT 系列的分工：GPT 系列更适合“脑洞/创意初稿”，Nano Banana 负责“精准落地与批量一致”。先让 GPT 头脑风暴 moodboard，再用 Nano Banana 做精修合成，是当前内容生产的“性价比组合”。



# Nano Banana: Comprehensive Collection of Information

## Introduction and Overview  
“Nano Banana” (officially Gemini 2.5 Flash Image) is Google’s latest state-of-the-art AI image generation and editing model, developed by Google DeepMind. It is designed for high-speed, high-fidelity, multi-turn creative workflows, enabling both generation and editing of images through natural language prompts rather than traditional editing software.  

***

## Official Product Description from NanoBanana.ai  
Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.

Try The AI Editor  

Experience the power of nano-banana’s natural language image editing. Transform any photo with simple text commands.

> Transform your image with AI-powered editing  
> Your ultra-fast AI creations appear here instantly  
> Ready for instant generation  
> Enter your prompt and unleash the power  

**Why Choose Nano Banana?**  
- Revolutionary AI image editing model on LMArena.  
- Edit images using simple text prompts; understands complex instructions like GPT for images.  
- Maintain perfect character details across edits; excels at preserving faces and identities.  
- Seamlessly blend edits with original backgrounds; superior scene fusion compared to Flux Kontext.  
- Perfect results in a single attempt; solves one-shot image editing challenges effortlessly.  
- Process multiple images simultaneously; supports advanced multi-image editing workflows.  
- Create consistent AI influencers and UGC content; ideal for social media and marketing campaigns.  

**Lightning-Fast AI Creations**  
- Created in 0.8 seconds with Nano Banana’s optimized neural engine.  
- Complex scenes rendered in milliseconds; deliver photorealistic results at lightning speed.  
- Advanced effects processed instantly.  

**User Testimonials**  
> “This editor completely changed my workflow. The character consistency is incredible — miles ahead of Flux Kontext!”  
> “Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!”  
> “One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!”  

**Usage**  
1. Upload an image.  
2. Enter a natural language prompt (e.g., “place the creature in a snowy mountain” or “imagine the whole face and create it”).  
3. Nano Banana processes the prompt and generates the edited image.  

**Capabilities**  
- Character consistency, scene blending, one-shot editing.  
- Multi-image context; ideal for creating consistent AI influencers.  
- Complex edits: face completion, background changes, object placement, style transfers, character modifications.  
- Contextual instructions: understands “place in a blizzard,” “create the whole face,” etc.  

**Applications**  
- AI UGC content, social media campaigns, marketing materials, product photography.  
- High-quality outputs suitable for professional use.

***

## Google Blog: Gemini App Integration  
**Source:** “Nano Banana! Image editing in Gemini just got a major upgrade”

> Today in the Gemini app, we’re unveiling a new image editing model from Google DeepMind. People have been going bananas over it already in early previews — it’s the top-rated image editing model in the world. Now, we’re excited to share that it’s integrated into the Gemini app so you have more control than ever to create the perfect picture.

### Maintain Your Look as You Edit  
- Native image editing launched earlier this year; focus on maintaining character likeness across edits.  
- Subtle flaws matter: ensure photos of people (or pets) look consistently like themselves through multiple edits.  

> Just give Gemini a photo to work with, and tell it what you’d like to change to add your unique touch. Gemini lets you combine photos to put yourself in a picture with your pet, change the background of a room to preview new wallpaper or place yourself anywhere in the world you can imagine — all while keeping you, you. Once you’re done, you can even upload your edited image back into Gemini to turn your new photo into a fun video.

### Bring Your Vision to Life with Advanced Editing  
- **Give yourself a costume or location change**: Upload a photo, keep the subject’s look the same, and place them in new scenarios (e.g., different outfits, professions, eras).  
- **Blend photos together**: Upload multiple photos and blend them into a cohesive new scene (e.g., portrait of you and your dog on a basketball court).  
- **Multi-turn editing**: Iteratively edit specific parts of an image (e.g., paint walls, add furniture) while preserving the rest.  
- **Design mixing**: Apply the style of one image to an object in another (e.g., flower petal texture on rainboots, butterfly wing pattern on a dress).  

> Both paid and unpaid users globally can try this updated image editing capability in the Gemini app starting today. All images created or edited in the Gemini app include a visible watermark, as well as our invisible SynthID digital watermark, to clearly show they are AI-generated.

***

## Replicate.com Developer Readme  
**Source:** “Nano Banana | Google | Image Editing” on Replicate  

#### Readme  
Gemini 2.5 Flash Image is Google’s state-of-the-art image generation and editing model. It is a new variant of the Gemini 2.5 family, specifically designed for fast, conversational, and multi-turn creative workflows. This model is made available to developers through the Gemini API, Google AI Studio, and Vertex AI.

### Key Features  
1. **Native Image Generation and Editing**  
   - Multimodal model understands and generates images, enabling a unified workflow for creating and editing visuals.  

2. **Multi-image Fusion**  
   - Combine multiple input images into a single cohesive visual (e.g., integrate a product into a new scene or restyle a room by merging images of different furniture and decor).  

3. **Character and Style Consistency**  
   - Maintains consistent appearance of characters, objects, or styles across multiple prompts and images, essential for storytelling, branding, and cohesive asset series without fine-tuning.  

4. **Conversational Editing**  
   - Precise, targeted edits via natural language (e.g., blur background, remove object, alter pose, colorize black-and-white photo).  

5. **Visual Reasoning**  
   - Leverages Gemini model’s world knowledge for complex tasks requiring genuine understanding (e.g., interpreting diagrams, educational assistance, multi-step instructions).  

6. **SynthID Watermarking**  
   - Invisible digital watermark embedded in all generated or edited images to identify AI-generated content and promote responsible AI use.  

### How to Use  
- **Gemini API**: Programmatic access; provide image data inline or via File API for larger files and repeated use.  
- **Google AI Studio**: Web-based environment; user-friendly interface for testing, experimentation, and building AI-powered apps using built-in templates.  
- **Vertex AI**: Enterprise platform on Google Cloud; offers security features, fine-tuning, and scalable deployment.

***

## YouTube Content Summaries and Demonstrations

### “I got a private lesson on Google’s NEW Nano Banana AI Model” (Host: Logan Kilpatrick on IdeaBrowser Podcast)  
- Gemini 2.5 Flash Image (Nano Banana) excels at fast image generation and editing with high quality at low cost (~4¢ per image).  
- **Practical Applications**: Marketing asset creation, product placement, interactive experiences.  
- **AI Studio Access**: Free experimentation via chat and pre-built applications.  
- **Product Applications**:  
  - Upload product photo → transform into magazine ads, murals, subway posters with AI-generated slogans; brand consistency across formats.  
  - Natural language image editing: “remove the logo,” multi-turn edits, precise area selection, filters/effects via prompt.  
- **Vibe Coding**: Developers can create custom filters, product visualization tools, interactive content from static images, specialized marketing generators.  
- **Competitive Edge**: Speed (seconds not minutes) and low cost enable new product possibilities and user experiences at scale.

### “Google’s Nano Banana JUST Dropped and It’s BANANAS! (FULL DEMO)” (CyberJungle Channel)  
- **Character Consistency**: Seamlessly maintain a character’s identity while changing expressions, hairstyles, outfits.  
- **Cinematic Universe Creation**: Build cohesive narratives from single images by altering settings, camera angles, adding elements.  
- **Product Photography & Ad Creation**: Design ad posters and product mockups.  
- **Detailed Tests**:  
  - Consistency test with host’s own photo (laughter expression).  
  - Real-world applications: close-up product shots, brand preservation in edits, camera angle changes, long text rendering on surfaces, historical photo restoration and colorization.  
- **Comparison with Other Models**:  
  - Nano Banana outperforms GPT-based and other image models in character consistency and realism.  
  - Strong results for photorealism; limitations noted (e.g., very distant small details, long text imperfections).  
- **Interior Redecoration**: Upload architectural photos and redecorate rooms with furniture and decor changes via prompts.

### “Google Gemini’s Nano Banana Makes Photo Edits EASY” (Teacher’s Tech Channel)  
- **Likeness Preservation**: Keeps subjects consistent across scene changes.  
- **Photo Blending & Design Mixing**: Combine images and apply style transfers.  
- **Multi-Turn Editing**: Iterative refinement (e.g., add a rabbit, remove objects, adjust lighting and mood) through conversational prompts.  
- **SynthID Watermarks**: Visible and invisible markings to identify AI-generated edits.  
- **Demonstrations**: Dog photo editing (adding a rabbit, removing a Frisbee), mood adjustments, follow-up edits through chat interface.

***

## Reddit Community Reactions  
**Source:** r/singularity thread “Nano Banana is rolling out!”  

- Mixed opinions on safety measures, pricing, and feature effectiveness.  
- Concerns about overpricing compared to other models; discussion of token-based pricing (e.g., $30 for 1M image editing tokens).  
- Queries about access via Gemini website (gemini-2.5-flash-image-preview).

***

## Conclusion  
This collection aggregates detailed descriptions, feature lists, usage instructions, developer integration guides, demonstrations, community feedback, and testimonials about Nano Banana (Gemini 2.5 Flash Image). It captures the breadth of available information—covering everything from basic usage to advanced developer workflows, from marketing applications to community discourse—without summarization or omission.

[1](https://nanobanana.ai)
[2](https://www.youtube.com/watch?v=3Zvk4AMCrG8)
[3](https://arstechnica.com/ai/2025/08/google-improves-gemini-ai-image-editing-with-nano-banana-model/)
[4](https://www.youtube.com/watch?v=-CEAj3Q_yd8)
[5](https://www.youtube.com/watch?v=QGvRZmG_ZKA)
[6](https://www.reddit.com/r/singularity/comments/1n0l6bj/nano_banana_is_rolling_out/)
[7](https://blog.google/intl/en-mena/product-updates/explore-get-answers/nano-banana-image-editing-in-gemini-just-got-a-major-upgrade/)
[8](https://replicate.com/google/nano-banana)