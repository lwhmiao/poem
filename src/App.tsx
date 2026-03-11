import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, RefreshCw, Palette, Edit3 } from 'lucide-react';

// 古典配色方案
const COLOR_SCHEMES = [
  {
    name: '青山',
    bg: '#F4F5F0', // 米白
    banner: '#E6EBE0', // 浅青
    textPrimary: '#1A2620', // 深墨绿
    textSecondary: '#2C3E35', // 墨绿
    buttonBg: '#4A5D4E',
  },
  {
    name: '朱砂',
    bg: '#F9F6F0', // 珍珠白
    banner: '#F0E5DF', // 藕色
    textPrimary: '#4A2511', // 栗色
    textSecondary: '#6B3F27', // 赭石
    buttonBg: '#8B4530',
  },
  {
    name: '月白',
    bg: '#F0F4F6', // 月白
    banner: '#DCE5E9', // 云峰白
    textPrimary: '#15232B', // 藏青
    textSecondary: '#2B3D4A', // 黛蓝
    buttonBg: '#3A5A6E',
  },
  {
    name: '秋香',
    bg: '#F8F4ED', // 象牙白
    banner: '#EBE1D5', // 浅驼
    textPrimary: '#3E2C1A', // 深褐
    textSecondary: '#5C462E', // 枯叶
    buttonBg: '#8C6A43',
  }
];

export default function App() {
  const [poem, setPoem] = useState(() => localStorage.getItem('poem_text') || '');
  const [source, setSource] = useState(() => localStorage.getItem('poem_source') || '');
  const [explanation, setExplanation] = useState(() => localStorage.getItem('poem_exp') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentColors = COLOR_SCHEMES[colorIndex];

  const fetchPoem = async () => {
    setLoading(true);
    setError('');
    try {
      // 模拟网络请求的延迟，让加载动画更自然
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const quotes = [
        {
          "lines": "居高声自远，非是藉秋风。",
          "source": "唐·虞世南《蝉》",
          "explanation": "蝉站得高，声音自然传得远，不需要借助秋风。真正有内涵的人，不靠外力吹捧，自然会被人看见——底气，从来都是由内而外生长出来的。"
        },
        {
          "lines": "不畏浮云遮望眼，只缘身在最高层。",
          "source": "宋·王安石《登飞来峰》",
          "explanation": "站得够高，浮云便遮不住视野。看事情的格局，决定了你会不会被眼前的迷雾困住。眼界是最难得的东西，也是最值得用一生去修炼的东西。"
        },
        {
          "lines": "松树千年终是朽，槿花一日自为荣。",
          "source": "唐·白居易《放言五首·其五》",
          "explanation": "松树活了千年终究腐朽，木槿花只开一天却自有其荣光。长短不是价值的标准，活得是否充实、是否忠于自己，才是真正值得问的问题。"
        },
        {
          "lines": "不羡王公与贵人，唯将云鹤自相亲。",
          "source": "唐·李洞《赠僧》",
          "explanation": "不羡慕王侯贵族的荣华，只愿与云与鹤为伴。真正的自由，是对外在名利的彻底不在乎，把心放在自己真正热爱的地方。"
        },
        {
          "lines": "草木有本心，何求美人折！",
          "source": "唐·张九龄《感遇十二首·其一》",
          "explanation": "草木生长，只是顺应本性，从不为了被人欣赏而存在。做自己，不是一种姿态，而是一种底层的清醒——无需他人的认可来证明自己的价值。"
        },
        {
          "lines": "杨花榆荚无才思，惟解漫天作雪飞。",
          "source": "唐·韩愈《晚春》",
          "explanation": "杨花榆荚没有才气，却也懂得趁着春光漫天飞舞。不必羡慕别人的天赋，找到属于自己的方式尽情绽放，便是对生命最好的回应。"
        },
        {
          "lines": "何须浅碧深红色，自是花中第一流。",
          "source": "宋·李清照《鹧鸪天·桂花》",
          "explanation": "桂花不靠颜色争艳，却自有一番风骨。真正的出众，不是和别人比谁更耀眼，而是做最好的自己——气质这件事，从不需要解释。"
        },
        {
          "lines": "苔花如米小，也学牡丹开。",
          "source": "清·袁枚《苔》",
          "explanation": "苔藓的花细如米粒，生长在阴暗角落，却也认认真真地开放，丝毫不输牡丹的气魄。出身微末，不是不努力绽放的理由。"
        },
        {
          "lines": "不要人夸好颜色，只留清气满乾坤。",
          "source": "元·王冕《墨梅》",
          "explanation": "画中的梅花不需要人称赞颜色好看，只愿将清香留在天地之间。做人也是如此：不求掌声，但求问心无愧，留一份清白在世上。"
        },
        {
          "lines": "竞夸天下无双艳，独立人间第一香。",
          "source": "唐·皮日休《牡丹》",
          "explanation": "人人夸牡丹艳冠天下，却忽略了它独一无二的香气。真正的价值，往往藏在那些不被喧嚣注意到的地方，等待真正懂得的人去发现。"
        },
        {
          "lines": "因病得闲殊不恶，安心是药更无方。",
          "source": "宋·苏轼《病中游祖塔院》",
          "explanation": "因为生病而得了闲暇，其实也没什么不好；让内心安定，才是最好的药，没有比这更管用的方子了。慢下来，有时候反而是一种治愈。"
        },
        {
          "lines": "心安身自安，身安室自宽。",
          "source": "宋·邵雍《心安吟》",
          "explanation": "心安定了，身体自然舒泰；身体舒泰了，就算居室狭小也觉得宽敞。所有外在的困窘，都可以被内心的从容所消解。"
        },
        {
          "lines": "随分自安心自断，是非何用问闲人。",
          "source": "唐·白居易《自咏》",
          "explanation": "随遇而安，是非对错自己心里清楚，何必去问别人怎么看。别人的评判左右不了内心真正的答案，活明白了，就不需要那么多旁观者的裁决。"
        },
        {
          "lines": "我生本无乡，心安是归处。",
          "source": "唐·白居易《初出城留别》",
          "explanation": "人生本来就没有固定的故乡，哪里心安，哪里便是归处。漂泊不是问题，内心的安定才是真正的根——找到它，走到哪里都是家。"
        },
        {
          "lines": "不羡荣华好，不羞贫贱恶。",
          "source": "唐·王梵志《诗并序·其五十六》",
          "explanation": "不羡慕荣华富贵，也不因贫贱而羞耻。真正的自尊，不建立在外部条件上——既不仰望，也不自卑，这才是最难得的平和。"
        },
        {
          "lines": "人生不向花前醉，花笑人生也是呆。",
          "source": "明·唐伯虎《花下酌酒歌》",
          "explanation": "人生不趁着花开时痛快饮一场，花都要笑你傻。及时行乐不是堕落，而是懂得珍惜——眼前的美好若不去享受，等它消逝了才后悔，那才是真的可惜。"
        },
        {
          "lines": "吾生梦幻间，何事绁尘羁。",
          "source": "东晋·陶渊明《饮酒·其八》",
          "explanation": "人生如梦幻，有什么必要被尘世的缰绳束缚住？陶渊明的潇洒不是逃避，而是一种看透之后的清醒——不值得的牵绊，放下便是解脱。"
        },
        {
          "lines": "世界微尘里，吾宁爱与憎。",
          "source": "唐·李商隐《北青萝》",
          "explanation": "整个世界不过是微尘，而我仍愿意在其中爱恨分明。渺小不是冷漠的理由，有情有义地活着，哪怕世界如尘，也自有其重量。"
        },
        {
          "lines": "试问岭南应不好，却道：此心安处是吾乡。",
          "source": "宋·苏轼《定风波·南海归赠王定国侍人寓娘》",
          "explanation": "被问起岭南是否艰苦，她却说：心安定的地方，就是我的故乡。这是一种极深的自由——不被环境左右，随遇而安，走到哪里都能扎根。"
        },
        {
          "lines": "海棠庭院又春深，一寸光阴万两金。",
          "source": "明·唐伯虎《惜花春起早》",
          "explanation": "海棠花开，春意正浓，一寸光阴抵得上万两黄金。春光短暂，人生更短，趁着最好的时候去做最想做的事，才是对时光最好的回报。"
        },
        {
          "lines": "莫恨流年似水，恨消残蝶粉，韶光忒浅。",
          "source": "清·纳兰性德《齐天乐·上元》",
          "explanation": "不要只恨时光流逝，更可惜的是那些在流逝中悄然消磨掉的美好。时间的问题从来不是快慢，而是我们有没有认真活过每一段。"
        },
        {
          "lines": "三百六旬有六日，光阴过眼如奔轮。",
          "source": "宋·邵雍《光阴吟》",
          "explanation": "一年三百六十六天，光阴在眼前飞转如轮。数字说起来平常，细想却令人心惊——每一天都是不可逆的消耗，也是不可复制的机会。"
        },
        {
          "lines": "天上浮云似白衣，斯须变幻如苍狗。",
          "source": "唐·杜甫《可叹》",
          "explanation": "天上的浮云转眼从白衣变成苍狗，世事变化之快令人叹息。人生的际遇本就无常，与其执着于某个状态，不如学会在变化中保持清醒。"
        },
        {
          "lines": "韶华争肯偎人住？已是滔滔去。",
          "source": "宋·董士锡《虞美人》",
          "explanation": "美好的年华哪里肯依偎着人停留？早已滔滔而去了。时光不会为任何人放慢脚步，唯一能做的，是在它流走之前，把该做的事做了。"
        },
        {
          "lines": "少年易老学难成，一寸光阴不可轻。",
          "source": "宋·朱熹《劝学诗》",
          "explanation": "人老得快，学问却难以速成。每一寸时光都不能轻易放过——不是要逼自己焦虑，而是提醒自己：今天没有珍惜的，明天无法找回。"
        },
        {
          "lines": "岁月人间促，烟霞此地多。",
          "source": "唐·朱放《题竹林寺》",
          "explanation": "人间岁月匆匆，而此地烟霞却如此充盈。在美好的地方，时光仿佛也放慢了脚步。人生短促，更要学会在美好中停留，而不是总在奔赴下一个地方。"
        },
        {
          "lines": "天德悠且长，人命一何促。",
          "source": "佚名《怨诗行》",
          "explanation": "天地悠悠，而人的生命何其短暂。这不是悲观，而是一种警醒：正因为短促，每一刻才更值得认真对待，而不是随意挥霍。"
        },
        {
          "lines": "催促年光，旧来流水知何处。",
          "source": "宋·廖世美《烛影摇红·题安陆浮云楼》",
          "explanation": "岁月催人老，那些流走的年华，如同逝去的流水，不知去了何处。我们能留住的，不是时间本身，而是在时间里刻下的那些真实的痕迹。"
        },
        {
          "lines": "君看今古悠悠，浮幻人间世。",
          "source": "宋·苏轼《哨遍·春词》",
          "explanation": "看看古往今来，人间不过是一场浮幻。历史的长河里，再轰烈的事都会归于平静——这不是虚无，而是提醒我们把目光放回当下真正珍贵的东西上。"
        },
        {
          "lines": "少壮不努力，老大徒伤悲。",
          "source": "汉·佚名《长歌行》",
          "explanation": "年轻时不肯努力，年老了只能白白悲叹。这句话说了千年，却仍有人到暮年才真正懂得。努力的意义，不只是为了成功，更是为了不留遗憾。"
        },
        {
          "lines": "欲穷千里目，更上一层楼。",
          "source": "唐·王之涣《登鹳雀楼》",
          "explanation": "想要看得更远，就必须再往上走一层。人生的视野，是一步一步走出来的，没有人一出发就站在最高处——想看见更多，就得先肯再努力一点。"
        },
        {
          "lines": "百尔所思，不如我所之。",
          "source": "先秦·《诗经·载驰》",
          "explanation": "你们千思万想，不如我亲自走一趟。思考再多，终究不如行动来得真实。想清楚了就去做，这才是对自己最负责任的态度。"
        },
        {
          "lines": "读书破万卷，下笔如有神。",
          "source": "唐·杜甫《奉赠韦左丞丈二十二韵》",
          "explanation": "读书读透了万卷，下笔时自然如有神助。积累是一个漫长而沉默的过程，但所有厚积薄发的时刻，都是用那些无人看见的积累换来的。"
        },
        {
          "lines": "看似寻常最奇崛，成如容易却艰辛。",
          "source": "宋·王安石《题张司业诗》",
          "explanation": "看起来平常的东西，往往最不寻常；看起来轻松完成的事，背后藏着不为人知的艰辛。所有云淡风轻，都是无数努力之后才换来的。"
        },
        {
          "lines": "时人不识凌云木，直待凌云始道高。",
          "source": "唐·杜荀鹤《小松》",
          "explanation": "人们总是等到松树已经参天，才说它高。没有人在意种子时的艰难生长——世界喜欢锦上添花，但真正的生长，发生在没人看见的时候。"
        },
        {
          "lines": "一岁之事勤在春，一日之事勤在晨。",
          "source": "宋·邵雍《观事吟》",
          "explanation": "一年的事情，贵在春天就开始用功；一天的事情，贵在清晨就着手去做。好的开始本身就是一种动力，起点选对了，方向就不会偏。"
        },
        {
          "lines": "穿天透地不辞劳，到底方知出处高。",
          "source": "清·冯云山《咏瀑布》",
          "explanation": "瀑布穿山透地，不辞辛劳，到了最低处才知道它的源头有多高。真正的高度，不是站在顶端时的风光，而是一路向下冲破一切的那股劲。"
        },
        {
          "lines": "时人不识农家苦，将谓田中谷自生。",
          "source": "唐·颜仁郁《农家》",
          "explanation": "世人不懂农家的辛苦，以为田里的粮食是自己长出来的。所有理所当然的背后，都有人在默默承受——看见别人的付出，是一种最基本的善意。"
        },
        {
          "lines": "九府五铢世上珍，鲁褒曾咏道通神。劝君觅得须知足，虽解荣人也辱人。",
          "source": "唐·李峤《钱》",
          "explanation": "钱财是世上珍贵之物，能让人荣耀，也能让人蒙羞。钱本无罪，可怕的是对钱的执念——得到了不知足，便是钱奴役了人，而不是人驾驭了钱。"
        },
        {
          "lines": "吾富有钱时，妇儿看我好。吾若脱衣裳，与吾叠袍袄。",
          "source": "唐·王梵志《吾富有钱时》",
          "explanation": "有钱时妻儿对我好，连叠衣裳都抢着来做。这是千年前的句子，却照见了千年不变的人心。富贵时的好脸色，不一定是真情，看清楚了，反而是种清醒。"
        },
        {
          "lines": "苦恨年年压金线，为他人作嫁衣裳。",
          "source": "唐·秦韬玉《贫女》",
          "explanation": "年年辛苦绣嫁衣，却全是为别人做的。付出了全部心血，最终受益的却是别人——这种错位，是生活里最无声的悲凉，也是最值得深思的警示。"
        },
        {
          "lines": "羡君有酒能便醉，羡君无钱能不忧。",
          "source": "唐·张谓《赠乔琳》",
          "explanation": "羡慕你有酒便能痛快醉，羡慕你没有钱却也不忧愁。真正的富足，不在于口袋里有多少，而在于心里有多少——无欲无忧，才是最难得的境界。"
        },
        {
          "lines": "贵义轻财求俗誉，一钱与人便骄倨。",
          "source": "唐·皎然《戏赠吴冯》",
          "explanation": "嘴上说重义轻财，施舍一文钱就摆出高人一等的嘴脸。最可笑的，是那种用小恩小惠换来的优越感——真正的慷慨，从不需要让对方感到低人一等。"
        },
        {
          "lines": "东家一老婆，富来三五年。昔日贫于我，今笑我无钱。",
          "source": "唐·寒山《诗三百三首》",
          "explanation": "东家的老妇人，富起来不过三五年，当年比我还穷，如今却笑话我没有钱。人情冷暖，贫富易位之间便看得清清楚楚。世态炎凉，不必愤恨，看透便是。"
        },
        {
          "lines": "世人结交须黄金，黄金不多交不深。",
          "source": "唐·张谓《题长安壁主人》",
          "explanation": "世间的交情，往往离不开利益的衡量，钱不多，交情自然深不了。这是一句刺耳的清醒——正因如此，那些不需要黄金维系的友谊，才格外珍贵。"
        },
        {
          "lines": "富贵荣华莫强求，强求不出反成羞。",
          "source": "明·唐伯虎《叹世之一》",
          "explanation": "富贵荣华不要强求，越是强求往往越是落空，反而成了笑话。有些东西，顺势而来是缘分，强行追逐是执念——知道这个区别，才算活明白了。"
        },
        {
          "lines": "且趁闲身未老，尽放我、些子疏狂。",
          "source": "宋·苏轼《满庭芳·蜗角虚名》",
          "explanation": "趁着还没老、还有闲暇，就让自己痛快地疏狂一回吧。苏轼的洒脱不是颓废，而是清醒之后的从容——蜗角虚名终究是小，活得痛快才是真。"
        },
        {
          "lines": "人生似幻化，终当归空无。",
          "source": "东晋·陶渊明《归园田居·其四》",
          "explanation": "人生如梦幻泡影，终究归于虚无。这不是消极，而是陶渊明式的通透——看穿了终点，才知道当下最值得珍惜什么，才能真正放下不必要的执念。"
        },
        {
          "lines": "浮名浮利何济，堪留恋处，轮回仓猝。",
          "source": "宋·王安石《雨霖铃·孜孜矻矻》",
          "explanation": "虚名浮利到底有什么用？真正值得留恋的时光，在忙碌奔波中转眼就过去了。人总是在追逐不重要的东西，却让重要的东西悄悄溜走。"
        },
        {
          "lines": "多少长安名利客，机关用尽不如君。",
          "source": "宋·黄庭坚《牧童诗》",
          "explanation": "多少人在名利场上机关算尽，最后还不如一个无忧无虑的牧童自在。费尽心思得来的，未必是真正想要的；简单活着的人，往往才是真正的赢家。"
        },
        {
          "lines": "自古功名亦苦辛，行藏终欲付何人？",
          "source": "宋·王安石《读史》",
          "explanation": "自古以来，功名都是苦辛换来的，可到最后，这一切又能托付给谁？功名是一个人的事，但意义需要在人与人之间流传——独自成就，终究有几分寂寥。"
        },
        {
          "lines": "德尊一代常坎坷，名垂万古知何用！",
          "source": "唐·杜甫《醉时歌》",
          "explanation": "德行卓绝的人一生多坎坷，名声流传万古又有什么用！杜甫的悲愤里藏着深深的无奈——生前的苦难，不会因为身后的名声而消解。"
        },
        {
          "lines": "名利徒煎熬，安得闲余步。",
          "source": "唐·李白《古风》",
          "explanation": "名利不过是让人煎熬的东西，哪里能换来真正的闲适自在？李白一生求名又厌名，这句话道出了多少追逐者心底最真实的疲惫。"
        },
        {
          "lines": "新人虽可爱，无若故所欢。",
          "source": "三国·曹植《浮萍篇》",
          "explanation": "新人固然可爱，却比不上旧日的恋人。新鲜感会褪去，但与一个人共同经历的岁月，沉淀下来的情感，才是任何新人都无法替代的。"
        },
        {
          "lines": "男儿爱后妇，女子重前夫。",
          "source": "汉·辛延年《羽林郎诗》",
          "explanation": "男人往往爱新得的妻，女人却常常念旧日的夫。感情里，男女对旧情与新欢的态度各有不同，深情与薄情之间，往往只有当事人自己最清楚。"
        },
        {
          "lines": "但见新人笑，那闻旧人哭。",
          "source": "唐·杜甫《佳人》",
          "explanation": "只看见新人在笑，却听不见旧人在哭。世间多少聚散，都是这样——热闹永远在眼前，心碎永远在背后。喜新厌旧，是人性里最沉默的残忍。"
        },
        {
          "lines": "一尺深红胜曲尘，天生旧物不如新。",
          "source": "唐·温庭筠《南歌子词二首》",
          "explanation": "鲜艳的深红胜过暗淡的旧色，人们天生喜新厌旧。这是一句带着伤的清醒——不是对人性的谴责，而是对聚散无常最诚实的承认。"
        },
        {
          "lines": "新人莫恃新，秋至会无春。",
          "source": "唐·李端《妾薄命》",
          "explanation": "新人不要仗着年轻得意，秋天来了，春光就不再有了。今日的新欢，终将成为明日的旧人——时间公平地对待所有人，没有谁能永远占据新鲜的位置。"
        },
        {
          "lines": "茕茕白兔，东走西顾。衣不如新，人不如故。",
          "source": "佚名《古艳歌》",
          "explanation": "衣服是新的好，人却是旧的好。新衣可以再做，旧人却再难重逢。那些陪你走过最难时光的人，才是真正值得用一生珍惜的。"
        },
        {
          "lines": "故人虽故昔经新，新人虽新复应故。",
          "source": "南朝·江总《闺怨篇·其二》",
          "explanation": "旧人当年也曾是新人，新人日后也终将变成旧人。时间面前，人人平等——珍惜眼前的人，不是因为他永远新鲜，而是因为他一直在。"
        },
        {
          "lines": "故人疏而日忘兮，新人近而俞好。",
          "source": "汉·东方朔《自悲》",
          "explanation": "旧人渐渐疏远日益被遗忘，新人近在眼前自然越看越好。这是人心最真实的写照，也是最值得警惕的地方——不要让距离消磨了那些本应珍惜的情分。"
        },
        {
          "lines": "男儿不重旧，丈夫多好新。",
          "source": "唐·魏氏《赠外》",
          "explanation": "男人不看重旧情，总是喜欢新鲜的。这句出自女子之口，字里行间藏着几分心寒。情感里，专一是最稀缺的品质，也是最被低估的美德。"
        },
        {
          "lines": "人生贵相知，何必金与钱。",
          "source": "唐·李白《赠友人三首·其二》",
          "explanation": "人生最宝贵的，是遇见真正懂你的人，何必在乎金钱多少。钱买得到陪伴，却买不了真正的理解——被人读懂，才是最难得的富有。"
        },
        {
          "lines": "不羡一囊钱，唯重心襟会。",
          "source": "唐·徐谦《短歌二首·其二》",
          "explanation": "不羡慕一口袋的钱财，只看重心意相投的相遇。真正的富足，是找到能与你心意相通的人，那种相遇，比任何财富都更难得。"
        },
        {
          "lines": "自古圣贤尽贫贱，何况我辈孤且直！",
          "source": "南朝·鲍照《拟行路难·其六》",
          "explanation": "自古以来，圣贤大多清贫，更何况我们这些孤独而耿直的人。坚守本心是有代价的，清醒地接受这个代价，是一种悲壮，也是一种骄傲。"
        },
        {
          "lines": "有德必报之，千金耻为轻。",
          "source": "唐·李白《淮阴书怀寄王宗成》",
          "explanation": "有恩德必定要报答，千金之重也不嫌轻。李白的义气，不只是豪情，更是一种对人与人之间信义的坚守——懂得感恩，才是真正的人品。"
        },
        {
          "lines": "轻得易失，多谋少成。德无尽利，善无近名。",
          "source": "宋·邵雍《安分吟》",
          "explanation": "轻易得来的东西容易失去，谋划太多反而少有成就。真正的德行不追求尽得利益，真正的善举不为换取名声。做好事不图回报，才是真正的高尚。"
        },
        {
          "lines": "君不见管鲍贫时交，此道今人弃如土。",
          "source": "唐·杜甫《贫交行》",
          "explanation": "管仲与鲍叔牙在贫困中结下的友谊，如今已被人们抛弃如尘土。真正的友谊，建立在患难与共上，而不是建立在彼此有用上。"
        },
        {
          "lines": "千金何足重，所存意气间。",
          "source": "南朝·鲍照《代朗月行》",
          "explanation": "千金算得了什么，真正重要的是人与人之间的情义与气节。有了情义，千金轻如鸿毛；失去情义，万贯也不过是一堆冷冰冰的数字。"
        },
        {
          "lines": "相知两相得，一顾轻千金。",
          "source": "唐·李白《酬岑勋见寻就元丹丘对酒相待以诗见招》",
          "explanation": "彼此真正了解、相互珍重，一个回眸便抵得上千金。真正的知己，不需要用钱衡量，只需要被看见、被理解——那种感觉，无价。"
        },
        {
          "lines": "靡不有初，鲜克有终。",
          "source": "先秦·《诗经·荡》",
          "explanation": "做事的人，没有不认真开头的，却很少有人能坚持到最后。起点人人都有，终点才是真正的分水岭——坚持，是这世上最稀缺的能力之一。"
        },
        {
          "lines": "多花必早落，桃李不如松。",
          "source": "宋·邵雍《人心》",
          "explanation": "花开得太盛必然早落，桃李的繁华比不上松树的长久。人也一样，热烈耀眼的未必能走得远，沉稳踏实的往往才是真正经得起时间的。"
        },
        {
          "lines": "假金方用真金镀，若是真金不镀金。",
          "source": "唐·李绅《答章孝标》",
          "explanation": "假金才需要镀上真金来掩盖，真金根本不需要镀。真正有实力的人，不需要包装和炒作；越是需要大力宣传的，越值得仔细看清楚。"
        },
        {
          "lines": "当断不断，反受其乱。",
          "source": "宋·邵雍《当断吟》",
          "explanation": "该断的时候不断，反而会被乱局所累。犹豫是人生里最昂贵的代价——很多时候，不是我们没有能力做决定，而是不够勇敢去承担决定的后果。"
        },
        {
          "lines": "劝君不用分明语，语得分明出转难。",
          "source": "唐·罗隐《鹦鹉》",
          "explanation": "劝你说话不要太直白清楚，话说得越明白，处境反而越难堪。有时候，模糊是一种保护，也是一种智慧——话说七分，留三分给彼此都好。"
        },
        {
          "lines": "半开半落闲园里，何异荣枯世上人。",
          "source": "唐·罗隐《杏花》",
          "explanation": "闲园里的杏花，有的正开，有的已落，和世间人的起伏荣枯有什么不同？花开花落是自然，人的得失浮沉也是规律——见过足够多的盛衰，才真正懂得平常心。"
        },
        {
          "lines": "一双冷眼看世人，满腔热血酬知己。",
          "source": "清·袁枚《随园诗话·卷十六》",
          "explanation": "用冷静的眼光看待世间百态，把所有的热情与真心都留给真正值得的知己。不是冷漠，而是清醒——把能量用在对的人身上，才不辜负这一腔热血。"
        },
        {
          "lines": "人生聚散长如此，相见且欢娱。",
          "source": "宋·欧阳修《圣无忧·世路风波险》",
          "explanation": "人生本就是聚了又散、散了又聚，既然如此，相见的时候就好好欢喜吧。与其感叹无常，不如珍惜眼前——此刻在一起，就是最好的时光。"
        },
        {
          "lines": "世事如舟挂短篷，或移西岸或移东。",
          "source": "明·唐伯虎《警世》",
          "explanation": "世事就像挂着短篷的小船，时而漂向西岸，时而漂向东岸。人生的起落浮沉，谁也说不准——与其在意停靠在哪里，不如把船撑好，随机应变。"
        },
        {
          "lines": "浮生如此，别多会少，不如莫遇。",
          "source": "清·纳兰性德《水龙吟·再送荪友南还》",
          "explanation": "人生就是这样，离别多，相聚少，有时真觉得当初不如不遇。这不是后悔，而是因为太在乎——越是珍贵的相遇，离别时越是难以承受。"
        },
        {
          "lines": "离合理之常，聚散安足惊。",
          "source": "晋·李充《送许从诗》",
          "explanation": "离合本是常理，聚散何必大惊小怪。接受无常，不是麻木，而是一种成熟——懂得了聚散皆有定数，才能在离别时多一分从容。"
        },
        {
          "lines": "人是岭头云，聚散天谁管。",
          "source": "宋·周紫芝《卜算子·席上送王彦猷》",
          "explanation": "人就像山头的云，聚散谁能做主？这种无奈里藏着一种释然——既然命运的聚散不由人控制，那就把相聚时的每一刻都过得值得。"
        },
        {
          "lines": "难逢最是身强健，无定莫如人聚散。",
          "source": "宋·晏几道《木兰花》",
          "explanation": "最难得的是身体健康，最无法预料的是人的聚散。健康和相聚，都是平时最容易被忽视、失去后才最追悔的东西。"
        },
        {
          "lines": "朝云聚散真无那，百岁相看能几个。",
          "source": "宋·晏殊《木兰花》",
          "explanation": "早晨的云聚了又散，实在无可奈何；百年人生里，能相伴到老的又有几人？相守是奢侈品，拥有时要比任何时候都更懂得珍惜。"
        },
        {
          "lines": "人生在世间，聚散亦暂时。",
          "source": "唐·杜甫《送殿中杨监赴蜀见相公》",
          "explanation": "人活在世上，相聚与离散都不过是暂时的。这句话是杜甫送别友人时写的，平静之中藏着深情——正因为知道聚散皆暂时，才更懂得珍惜同行的每一段路。"
        },
        {
          "lines": "人间聚散真难料，莫叹平生信所之。",
          "source": "唐·张籍《酬杭州白使君兼寄浙东元大夫》",
          "explanation": "人间的聚散实在难以预料，不必叹息，只管跟随内心去走。人生的缘分从来说不清楚，与其感叹命运，不如坦然接受每一次相遇与告别。"
        },
        {
          "lines": "人生聚散苦难期，且喜清游酒满卮。",
          "source": "宋·余靖《和王子元重阳日千善寺会饮》",
          "explanation": "人生的聚散难以预期，苦多乐少，但此刻相聚游览，杯中酒满，且先高兴一场。人生苦短，不必总盯着无常，眼前这杯酒，眼前这个人，才是最真实的。"
        },
        {
          "lines": "妇人依倚子与夫，同居贫贱心亦舒。",
          "source": "唐·张籍《征妇怨》",
          "explanation": "妻子依靠丈夫和孩子，哪怕同居贫贱，内心也能舒坦。真正的幸福不在于物质的丰盛，而在于身边有相依的人——贫贱与共，有时比富贵孤独更值得羡慕。"
        },
        {
          "lines": "人生如此自可乐，岂必局束为人鞿？",
          "source": "唐·韩愈《山石》",
          "explanation": "人生本来可以自得其乐，何必束手束脚地被别人的眼光和规矩所缚？韩愈在山中游览时写下此句，是一种难得的放松——人生的枷锁，很多是自己套上去的。"
        },
        {
          "lines": "意气青云里，爽朗烟霞外。不羡一囊钱，唯重心襟会。",
          "source": "唐·徐谦《短歌二首·其二》",
          "explanation": "志气高远，胸怀开朗，不羡慕钱财，只看重心意相投的相逢。有些人，一见如故，胜过多年钱财积累——这种相遇，是人生最值钱的资产。"
        },
        {
          "lines": "衣食当须纪，力耕不吾欺。",
          "source": "东晋·陶渊明《移居二首》",
          "explanation": "衣食生计要自己去经营，努力耕耘不会欺骗自己。脚踏实地、靠自己双手生活，是陶渊明归隐后最朴素的信条——劳动不会撒谎，付出就有回报。"
        },
        {
          "lines": "甘瓜抱苦蒂，美枣生荆棘。利傍有倚刀，贪人还自贼。",
          "source": "汉·佚名《古诗二首·其二》",
          "explanation": "甜瓜连着苦蒂，美枣长在荆棘里；「利」字旁边就是一把刀，贪婪的人终究会伤到自己。天下没有只享甜头不付代价的事，贪字头上一把刀，古人早就看透了。"
        },
        {
          "lines": "无钱可沽酒，何以解劬劳？",
          "source": "唐·储光羲《同王十三维偶然作十首·其一》",
          "explanation": "没有钱买酒，拿什么来消解这一身的疲惫？穷困时的苦，不只是物质的匮乏，更是连一点小小的慰藉都求而不得的无奈。"
        },
        {
          "lines": "料钱用尽却为谤，食客空多谁报恩。",
          "source": "唐·刘长卿《江楼送太康郭主簿赴岭南》",
          "explanation": "钱财散尽换来的是诽谤，养了一堆食客却没人知恩图报。付出越多，有时候失望也越深——人心这本账，从来算不清楚。"
        },
        {
          "lines": "家人万里传消息，好在毡城莫相忆。",
          "source": "宋·王安石《明妃曲二首》",
          "explanation": "家人千里传来消息，说在塞外好好的，让家人不要挂念。思念最深的人，往往说出口的是「我很好，不用担心」——把牵挂藏起来，是一种爱，也是一种心酸。"
        },
        {
          "lines": "舍旧谋新，捉月拿云，撇了家乡，剩了孤身。",
          "source": "清·湘灵子《轩亭冤·哭墓》",
          "explanation": "为了追求新的东西，抛下了旧的一切，结果月没抓到，云没拿到，家乡也回不去了，只剩下孤零零的自己。贪新求变并非不好，但若连根都刨了，得到的未必是自由。"
        },
        {
          "lines": "相思千万里，一书值千金。",
          "source": "唐·李白《寄远十一首·其十》",
          "explanation": "相思跨越千万里，一封书信抵得上千金。在没有手机、没有网络的年代，远方的一封信是真实温度的传递——有时候，一句「我还好，我想你」，胜过千言万语。"
        },
        {
          "lines": "寸阴良可惜，千金本易挥。",
          "source": "唐·杨训《群公高宴诗》",
          "explanation": "一寸光阴值得珍惜，千金财富却容易挥霍。钱没了可以再赚，时间没了就是真的没了——这个道理人人都懂，却总是在时间流走之后才真正明白。"
        },
        {
          "lines": "百岁之后，归于其居。",
          "source": "先秦·《诗经·葛生》",
          "explanation": "百年之后，终将归回同一处安眠。爱一个人，可以深到愿意生死与共——这是《诗经》里最深情的誓言，也是对生死最从容的态度。"
        },
        {
          "lines": "人生不相见，动如参与商。",
          "source": "唐·杜甫《赠卫八处士》",
          "explanation": "人生聚少离多，就像参星和商星，此出彼没，永远不相见。杜甫与老友久别重逢，感慨系之——有些人，一别就是一辈子，所以相见时要格外珍惜。"
        }
      ];

      // 随机抽取一句
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const selectedQuote = quotes[randomIndex];

      setPoem(selectedQuote.lines);
      setSource(selectedQuote.source);
      setExplanation(selectedQuote.explanation);
      
      localStorage.setItem('poem_text', selectedQuote.lines);
      localStorage.setItem('poem_source', selectedQuote.source);
      localStorage.setItem('poem_exp', selectedQuote.explanation);

    } catch (err) {
      console.error(err);
      setError('获取诗词失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!poem) {
      fetchPoem();
    }
  }, []);

  // Sync manual edits to localStorage
  useEffect(() => {
    if (poem) localStorage.setItem('poem_text', poem);
    if (source) localStorage.setItem('poem_source', source);
    if (explanation) localStorage.setItem('poem_exp', explanation);
  }, [poem, source, explanation]);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    
    // 开启截图模式，移除动画和高度限制，确保完整渲染
    setIsCapturing(true);
    
    // 等待 React 重新渲染 DOM（去除 transition 和 max-height）
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(cardRef.current!, {
          scale: 3, // 提高清晰度
          backgroundColor: currentColors.bg,
          useCORS: true,
          allowTaint: true,
          scrollY: -window.scrollY, // 修复滚动偏移导致的截断
        });
        
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = image;
        link.download = `每日诗词_${new Date().getTime()}.png`;
        link.click();
      } catch (err) {
        console.error('导出图片失败', err);
        alert('导出图片失败，请重试');
      } finally {
        // 恢复正常模式
        setIsCapturing(false);
      }
    }, 150);
  };

  const changeColor = () => {
    setColorIndex((prev) => (prev + 1) % COLOR_SCHEMES.length);
  };

  const formatPoem = (text: string) => {
    // 如果用户手动输入了换行符，优先按换行符分割
    if (text.includes('\n')) {
      return text.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ));
    }
    // 否则尝试按逗号或分号分行，保持对仗美感
    const parts = text.split(/，|；/);
    if (parts.length === 2) {
      return (
        <>
          <p>{parts[0]}，</p>
          <p>{parts[1]}</p>
        </>
      );
    }
    return <p>{text}</p>;
  };

  // 截图时移除过渡动画类名，防止 html2canvas 捕获到中间状态导致颜色变浅
  const transitionClass = isCapturing ? '' : 'transition-colors duration-500 ease-in-out';
  const animationClass = isCapturing ? '' : 'animate-fade-in';

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 sm:p-8 gap-8 lg:gap-12 font-serif overflow-x-hidden">
      
      {/* Left/Top Panel: Editor & Actions */}
      <div className="w-full max-w-[420px] flex flex-col gap-6 lg:mt-8">
        
        {/* Editor */}
        <div className="bg-[#242424] border border-white/10 rounded-2xl p-5 shadow-xl">
          <h3 className="text-white/80 text-sm font-sans mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><Edit3 size={16}/> 内容编辑</span>
            <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/60">实时预览</span>
          </h3>
          <div className="space-y-4 font-sans">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 pl-1">诗句 (支持换行编辑)</label>
              <textarea
                value={poem}
                onChange={(e) => setPoem(e.target.value)}
                placeholder="例如：人心本是云边月，聚散原如陌上尘"
                rows={3}
                className="w-full bg-[#1a1a1a] text-white/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 pl-1">出处</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="例如：明·吕坤《呻吟语》"
                className="w-full bg-[#1a1a1a] text-white/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 pl-1">释义</label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="输入释义内容..."
                rows={4}
                className="w-full bg-[#1a1a1a] text-white/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 sm:gap-4 w-full">
          <button 
            onClick={changeColor}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-[#242424] text-white border border-white/10 rounded-full shadow-sm hover:bg-[#2c2c2c] transition-all font-sans text-sm sm:text-base flex-1"
          >
            <Palette size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>换配色</span>
          </button>
          <button 
            onClick={fetchPoem}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-[#242424] text-white border border-white/10 rounded-full shadow-sm hover:bg-[#2c2c2c] transition-all disabled:opacity-50 font-sans text-sm sm:text-base flex-1"
          >
            <RefreshCw size={16} className={`sm:w-[18px] sm:h-[18px] ${loading ? 'animate-spin' : ''}`} />
            <span>换一句</span>
          </button>
        </div>
      </div>

      {/* Right/Bottom Panel: Card Container & Save Action */}
      <div className="w-full max-w-[420px] flex flex-col items-center gap-6">
        <div 
          ref={cardRef}
          className={`relative flex flex-col shadow-2xl ${isCapturing ? '' : 'w-full max-w-[420px] overflow-hidden'} ${transitionClass}`}
          style={{ 
            aspectRatio: '3/4', 
            backgroundColor: currentColors.bg,
            // 截图时移除 maxHeight，强制宽度为 420px，保证完整渲染且比例正确
            maxHeight: isCapturing ? 'none' : '85vh',
            width: isCapturing ? '420px' : '100%',
            flexShrink: 0,
          }}
        >
          {/* Top Banner */}
          <div 
            className={`h-12 sm:h-14 flex items-center justify-end px-6 ${transitionClass}`}
            style={{ backgroundColor: currentColors.banner }}
          >
            <span 
              className="text-[15px] sm:text-[17px] tracking-[0.15em] font-medium"
              style={{ color: currentColors.buttonBg }}
            >
              每日诗词
            </span>
          </div>

          {/* Decorative Quote */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-2">
             <h2 
               className={`text-xl sm:text-2xl font-bold tracking-wider opacity-90 leading-relaxed ${transitionClass}`}
               style={{ color: currentColors.textSecondary }}
             >
               “救命！<br/><span className="pl-6 sm:pl-8">好喜欢这句啊！”</span>
             </h2>
          </div>

          {/* Poem Content */}
          <div className="flex-grow flex flex-col items-center justify-center px-6 sm:px-8 py-4 relative">
            {loading ? (
              <div className="flex flex-col items-center animate-pulse">
                <div 
                  className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-4"
                  style={{ borderColor: currentColors.buttonBg, borderTopColor: 'transparent' }}
                ></div>
                <p className="tracking-widest" style={{ color: currentColors.buttonBg }}>寻章摘句中...</p>
              </div>
            ) : error ? (
              <p className="text-red-800">{error}</p>
            ) : (
              <div className={`text-center space-y-4 w-full flex flex-col items-center ${animationClass}`}>
                <div 
                  className={`text-[22px] sm:text-[26px] font-medium tracking-[0.1em] sm:tracking-[0.15em] leading-[2] sm:leading-[2.2] w-full ${transitionClass}`}
                  style={{ color: currentColors.textPrimary }}
                >
                  {formatPoem(poem)}
                </div>
                {source && (
                  <div 
                    className={`w-full text-right text-[13px] sm:text-[14px] mt-3 pr-2 sm:pr-6 opacity-85 font-serif ${transitionClass}`}
                    style={{ color: currentColors.textSecondary }}
                  >
                    —— {source}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Explanation */}
          <div className="px-6 sm:px-8 pb-8 sm:pb-10">
            <div className="bg-transparent">
              <h3 
                className={`text-[17px] sm:text-[19px] font-bold mb-2 sm:mb-3 tracking-widest ${transitionClass}`}
                style={{ color: currentColors.textPrimary }}
              >
                【释义】
              </h3>
              <p 
                className={`px-3 sm:px-5 text-[14px] sm:text-[15px] leading-[1.7] sm:leading-[1.8] text-justify font-serif ${isCapturing ? '' : 'line-clamp-4 sm:line-clamp-none'} ${transitionClass}`}
                style={{ color: currentColors.textSecondary }}
              >
                {explanation || '...'}
              </p>
            </div>
          </div>
        </div>

        {/* Save Image Button (Moved to bottom) */}
        <button 
          onClick={downloadImage}
          disabled={loading || !poem}
          className="flex items-center justify-center gap-2 px-6 py-3.5 text-white rounded-full shadow-lg hover:opacity-90 transition-all disabled:opacity-50 font-sans text-base w-full sm:w-[80%] mt-2 mb-8 lg:mb-0"
          style={{ backgroundColor: currentColors.buttonBg }}
        >
          <Download size={18} />
          <span>保存图片</span>
        </button>
      </div>
    </div>
  );
}
