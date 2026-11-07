from pathlib import Path
import re,html
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,LongTable,TableStyle,KeepTogether,HRFlowable
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
base=Path(__file__).parent
pdfmetrics.registerFont(TTFont('DVS','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVS-Bold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFontFamily('DVS',normal='DVS',bold='DVS-Bold',italic='DVS',boldItalic='DVS-Bold')
green=colors.HexColor('#246851');ink=colors.HexColor('#253f36');muted=colors.HexColor('#63756b');pale=colors.HexColor('#edf3e8')
styles={
 'body':ParagraphStyle('body',fontName='DVS',fontSize=10.5,leading=16.2,textColor=ink,spaceAfter=10),
 'heading':ParagraphStyle('heading',fontName='DVS-Bold',fontSize=14.5,leading=20,textColor=green,spaceBefore=12,spaceAfter=12,keepWithNext=True),
 'small':ParagraphStyle('small',fontName='DVS',fontSize=8.5,leading=12.5,textColor=muted,spaceAfter=8),
 'cell':ParagraphStyle('cell',fontName='DVS',fontSize=9,leading=13,textColor=ink),
 'title':ParagraphStyle('title',fontName='DVS-Bold',fontSize=39,leading=47,textColor=green,spaceAfter=18),
 'subtitle':ParagraphStyle('subtitle',fontName='DVS',fontSize=18,leading=27,textColor=ink,spaceAfter=20)
}
def fmt(s):
 s=html.escape(s.strip())
 s=re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)',r'<link href="\2" color="#246851"><u>\1</u></link>',s)
 s=re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',s)
 s=re.sub(r'`([^`]+)`',r'<font color="#246851">\1</font>',s)
 return s
P=lambda s,kind='body':Paragraph(fmt(s),styles[kind])
text=(base/'sunum-metni.md').read_text()
sections=re.split(r'^## ',text,flags=re.M)[1:]
story=[Spacer(1,55),P('İyiAdım','title'),P('Geriatrik rehabilitasyon<br/>sunum konuşma metni'.replace('<br/>',' — '),'subtitle'),P('Ne geliştirdik? Neden geliştirdik? Rubrikteki gereksinimlere nasıl karşılık verdik?'),Spacer(1,15),HRFlowable(width='100%',thickness=2,color=green),Spacer(1,22),P('7 Kasım 2026 · Yaklaşık 15 dakika · 14 slayt akışı','small'),P('Kullanım: Metin, slaytların yanında konuşmacı notu olarak kullanılabilir. Son bölümlerde rubrik eşleştirmesi, kısa canlı gösterim ve olası sorular bulunur.'),Spacer(1,15),P('Uygulama: [fizyoappa.github.io/-yiad-m](https://fizyoappa.github.io/-yiad-m/)'),P('Kaynak kod: [GitHub deposu](https://github.com/Fizyoappa/-yiad-m)'),Spacer(1,15)]
qr=QrCodeWidget('https://fizyoappa.github.io/-yiad-m/');d=Drawing(90,90);b=qr.getBounds();d.add(qr);d.scale(90/(b[2]-b[0]),90/(b[3]-b[1]));story += [d,Spacer(1,20),P('Durum notu: Teknik özellikler ile klinik uzman onayı ayrı konulardır. Bu eğitim prototipi için klinik etkinlik veya hasta güvenliği doğrulanmış ürün iddiası bulunmaz.','small'),PageBreak()]
for idx,section in enumerate(sections):
 lines=section.strip().splitlines();title=lines[0];body='\n'.join(lines[1:]).strip()
 match=re.match(r'Slayt (\d+)',title)
 if match:
  n=int(match.group(1))
  if n>1 and n%2==1:story.append(PageBreak())
  elif n%2==0:story.extend([Spacer(1,8),HRFlowable(width='100%',thickness=.5,color=colors.HexColor('#d6e0d3')),Spacer(1,7)])
 else:story.append(PageBreak())
 story.append(P(title,'heading'))
 if body.startswith('|'):
  rows=[]
  for l in body.splitlines():
   if l.startswith('|') and not re.fullmatch(r'[| :\-]+',l): rows.append([P(x,'cell') for x in l.strip('|').split('|')])
  table=LongTable(rows,colWidths=[130,55,310],repeatRows=1,hAlign='LEFT')
  table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),pale),('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.5,colors.HexColor('#d9e2d4')),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]));story.append(table)
 else:
  for para in re.split(r'\n\s*\n',body):
   para=' '.join(x.strip() for x in para.splitlines())
   if para:story.append(P(para,'small' if title=='Sunum kaynakçası' else 'body'))

def page(c,doc):
 w,h=doc.pagesize;c.saveState();c.setStrokeColor(colors.HexColor('#dce5d8'));c.line(50,46,w-50,46);c.setFont('DVS',8);c.setFillColor(muted);c.drawString(50,31,'İyiAdım · Sunum konuşma metni · 07.11.2026');c.drawRightString(w-50,31,str(doc.page));c.restoreState()
out=base.parent/'docs'/'sunum-metni.pdf'
doc=SimpleDocTemplate(str(out),pagesize=(595.28,841.89),leftMargin=50,rightMargin=50,topMargin=44,bottomMargin=61,title='İyiAdım — Geriatrik Rehabilitasyon Sunum Metni',author='İyiAdım Projesi')
doc.build(story,onFirstPage=page,onLaterPages=page)
print(out)
