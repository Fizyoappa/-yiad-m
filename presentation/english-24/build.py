from pathlib import Path
import json,re,html
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,LongTable,TableStyle,HRFlowable,KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from docx import Document
from docx.shared import Inches,Pt,RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
base=Path(__file__).parent; data=json.loads((base/'content.json').read_text());out=base.parent.parent/'docs'/'presentation';out.mkdir(parents=True,exist_ok=True)
name='IyiAdim_24_Slide_Speaker_Script'
words=sum(len(re.findall(r'\S+',' '.join(s['text']))) for s in data['slides'])
# Plain text is intentionally complete and independently usable.
lines=['İyiAdım — Revised English Speaker Script','24 slides | '+str(words)+' spoken words | approximately 16–19 minutes including a short demo','Prepared: '+data['date'],'Live app: '+data['url'],'','PRESENTER NOTES — NOT SPOKEN','Read the slide paragraphs aloud. Screen cues are actions, not spoken lines.','Rehearse the demo with a fictional guest profile. Never use real patient information.','The appendices are reference material for questions and slide preparation.','']
for s in data['slides']:
 lines+=['SLIDE '+str(s['n'])+' — '+s['title'],'']
 if s.get('cue'):lines+=['[ON SCREEN — NOT SPOKEN] '+s['cue'],'']
 for p in s['text']:lines += [p,'']
lines+=['APPENDIX A — RUBRIC MAP (NOT SPOKEN)','']
for r in data['rubric']:lines += [f'{r[0]} — {r[1]} points: {r[2]}','']
lines+=['APPENDIX B — POSSIBLE QUESTIONS (NOT SPOKEN)','']
for i,(q,a) in enumerate(data['questions'],1):lines += [str(i)+'. '+q,a,'']
lines+=['APPENDIX C — REFERENCES (NOT SPOKEN)','']
for i,(t,u) in enumerate(data['references'],1):lines += [str(i)+'. '+t,u,'']
lines+=['Project source: https://github.com/Fizyoappa/-yiad-m','The clinical review protocol is prepared; clinician review and older-adult usability studies have not been completed.']
(out/(name+'.txt')).write_text('\n'.join(lines),encoding='utf-8')
# PDF.
pdfmetrics.registerFont(TTFont('DV','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'));pdfmetrics.registerFont(TTFont('DV-B','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'));pdfmetrics.registerFontFamily('DV',normal='DV',bold='DV-B',italic='DV',boldItalic='DV-B')
green=colors.HexColor('#246851');ink=colors.HexColor('#233e36');muted=colors.HexColor('#64746b');pale=colors.HexColor('#edf3e8')
styles={
 'body':ParagraphStyle('body',fontName='DV',fontSize=11,leading=17.5,textColor=ink,spaceAfter=12),
 'h':ParagraphStyle('h',fontName='DV-B',fontSize=15,leading=21,textColor=green,spaceAfter=14,keepWithNext=True),
 'label':ParagraphStyle('label',fontName='DV-B',fontSize=9,leading=13,textColor=green,spaceAfter=7,keepWithNext=True),
 'small':ParagraphStyle('small',fontName='DV',fontSize=9,leading=14,textColor=muted,spaceAfter=10),
 'cue':ParagraphStyle('cue',fontName='DV',fontSize=9,leading=14,textColor=ink,backColor=pale,borderPadding=10,spaceBefore=6,spaceAfter=20),
 'ref':ParagraphStyle('ref',fontName='DV',fontSize=9,leading=13.8,textColor=ink,spaceAfter=11),
 'cell':ParagraphStyle('cell',fontName='DV',fontSize=9,leading=13,textColor=ink),
 'title':ParagraphStyle('title',fontName='DV-B',fontSize=42,leading=51,textColor=green,spaceAfter=12),
 'sub':ParagraphStyle('sub',fontName='DV',fontSize=19,leading=28,textColor=ink,spaceAfter=22)
}
def P(s,kind='body',raw=False):return Paragraph(s if raw else html.escape(s),styles[kind])
def link(text,url):return '<link href="'+html.escape(url,quote=True)+'" color="#246851"><u>'+html.escape(text)+'</u></link>'
story=[Spacer(1,50),P('İyiAdım','title'),P('24-slide speaker script','sub'),P(data['subtitle']),Spacer(1,12),HRFlowable(width='100%',thickness=2,color=green),Spacer(1,22),P('REVISED ENGLISH EDITION','label'),P(f"{data['date']} · {words:,} spoken words · approximately 16–19 minutes",'small'),P('A complete speaking text with practical screen cues, a rubric map, short answers to likely questions and a full reference list.'),Spacer(1,12),P('HOW TO USE THIS SCRIPT','label'),P('Read only the slide paragraphs aloud. Shaded screen cues and all appendices are presenter material. Timing depends on your speaking pace and demo pauses; confirm it by rehearsal.','small'),P(link('Open the live application',data['url']),'body',True)]
qr=QrCodeWidget(data['url']);b=qr.getBounds();d=Drawing(85,85);d.add(qr);d.scale(85/(b[2]-b[0]),85/(b[3]-b[1]));story += [d,Spacer(1,16),P('Use a fictional profile for the demonstration. The app is a guideline-informed educational prototype; clinical validation and older-adult usability studies are pending.','small'),PageBreak()]
for s in data['slides']:
 n=s['n']
 if n>1 and n%2==1:story.append(PageBreak())
 elif n%2==0:story.extend([Spacer(1,11),HRFlowable(width='100%',thickness=.5,color=colors.HexColor('#d9e2d4')),Spacer(1,19)])
 story.append(P(f'SLIDE {n:02d}','label'));story.append(P(s['title'],'h'))
 if s.get('cue'):story.append(P('ON SCREEN — NOT SPOKEN: '+s['cue'],'cue'))
 story.extend(P(t) for t in s['text'])
story.extend([PageBreak(),P('Appendix A — Rubric map','h'),P('Reference material for the presenter. These are feature mappings, not predicted marks or proof of clinical effectiveness.','small')])
rows=[[P(x,'cell') for x in ['Criterion','Points','Our response']]]+[[P(x,'cell') for x in row] for row in data['rubric']]
t=LongTable(rows,colWidths=[124,46,325],repeatRows=1,hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),pale),('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.5,colors.HexColor('#d8e1d4')),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9)]));story.append(t)
story.extend([Spacer(1,18),P('Status: technical functions have been implemented and tested in the project. Clinical review, older-adult usability studies and physical-device notification/sensor validation remain separate evaluation tasks.','small'),PageBreak(),P('Appendix B — Likely questions','h'),P('Use these short answers as prompts, rather than memorising them word for word.','small')])
for i,(q,a) in enumerate(data['questions'],1):story.append(KeepTogether([P(str(i)+'. '+q,'label'),P(a)]))
story.extend([PageBreak(),P('Appendix C — References','h'),P('Put readable citations on the reference slide or an accompanying handout. Links below open the source. This list supports a targeted guideline review, not a systematic review.','small')])
for i,(title,url) in enumerate(data['references'],1):story.append(P(html.escape(str(i)+'. '+title)+' '+link('Open source',url),'ref',True))
story.extend([Spacer(1,8),P('Project materials','label'),P(link('Live app',data['url'])+' · '+link('Source repository','https://github.com/Fizyoappa/-yiad-m'),'ref',True),P('The literature review, test-status record and future clinical/usability review protocol are available in the project. Technical tests should not be described as evidence of patient benefit.','small')])
def footer(c,doc):
 c.saveState();w,h=doc.pagesize;c.setStrokeColor(colors.HexColor('#dce5d8'));c.line(50,45,w-50,45);c.setFont('DV',8);c.setFillColor(muted);c.drawString(50,30,'İyiAdım · English speaker script · 11 November 2026');c.drawRightString(w-50,30,str(doc.page));c.restoreState()
SimpleDocTemplate(str(out/(name+'.pdf')),pagesize=(595.28,841.89),leftMargin=50,rightMargin=50,topMargin=43,bottomMargin=62,title='İyiAdım — 24-slide English Speaker Script',author='İyiAdım Project').build(story,onFirstPage=footer,onLaterPages=footer)
# Editable Word document, matching the same script.
doc=Document();sec=doc.sections[0];sec.top_margin=Inches(.75);sec.bottom_margin=Inches(.7);sec.left_margin=Inches(.8);sec.right_margin=Inches(.8)
for st in ['Normal','Body Text']:
 doc.styles[st].font.name='Arial';doc.styles[st].font.size=Pt(11);doc.styles[st].paragraph_format.line_spacing=1.2;doc.styles[st].paragraph_format.space_after=Pt(9)
for st in ['Title','Heading 1','Heading 2','Heading 3']:
 doc.styles[st].font.name='Arial';doc.styles[st].font.color.rgb=RGBColor.from_string('246851')
doc.add_heading('İyiAdım',0);doc.add_heading('24-slide English speaker script',1);doc.add_paragraph(data['subtitle']);doc.add_paragraph(f"{data['date']} | {words:,} spoken words | approximately 16–19 minutes")
doc.add_paragraph('Read only the slide paragraphs aloud. Screen cues and appendices are presenter notes. Use a fictional profile and rehearse before presenting.');doc.add_paragraph('Live app: '+data['url']);doc.add_paragraph('Clinical validation and older-adult usability studies are pending.');doc.add_page_break()
for s in data['slides']:
 if s['n']>1 and s['n']%2==1:doc.add_page_break()
 doc.add_heading(f"SLIDE {s['n']} — {s['title']}",1)
 if s.get('cue'):
  para=doc.add_paragraph();r=para.add_run('ON SCREEN — NOT SPOKEN: '+s['cue']);r.italic=True;r.font.size=Pt(9)
 for text in s['text']:doc.add_paragraph(text)
doc.add_page_break();doc.add_heading('Appendix A — Rubric map',1);table=doc.add_table(rows=1,cols=3);table.style='Light Shading Accent 1'
for c,t in zip(table.rows[0].cells,['Criterion','Points','Our response']):c.text=t
for row in data['rubric']:
 for c,t in zip(table.add_row().cells,row):c.text=t
trpr=table.rows[0]._tr.get_or_add_trPr();repeat=OxmlElement('w:tblHeader');trpr.append(repeat)
doc.add_page_break();doc.add_heading('Appendix B — Likely questions',1)
for i,(q,a) in enumerate(data['questions'],1):doc.add_heading(str(i)+'. '+q,2);doc.add_paragraph(a)
doc.add_page_break();doc.add_heading('Appendix C — References',1)
for i,(t,u) in enumerate(data['references'],1):doc.add_paragraph(str(i)+'. '+t+'\n'+u)
footer=sec.footer.paragraphs[0];footer.add_run('İyiAdım · English speaker script | ');field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
doc.save(str(out/(name+'.docx')))
print(json.dumps({'words':words,'output':str(out),'files':[name+'.'+ext for ext in ['pdf','docx','txt']]}))
