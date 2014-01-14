# DIARY

## 13 giugno 2013
commentato CKEditor in app.js

## 17 giugno 2013
app.Portfolio sembra quasi sembra undefined - almeno fino a che app.VLnet non ritorna la pagina - ma mentre in BackendView alla fine (non so come) i lavori compaiono, in FrontendView non si accede mai ai documenti della collection.

## 2 luglio 2013
sistemato router su branch master.
creato branch db per sviluppo interfaccia DB

## 7 luglio
collegato DB su branch db e iniziati test, testata connessione DB (ok) e Index view init (ok)
la app/#/index non visualizza i lavori, il pb. sembra provenire da vlnet.js:21, in ogni caso prima procedere con i test

## 8 luglio
test con fixture per verificare WorkView e FrontendView, tutto ok

## 17 agosto
as on 21 july googled "backbone after calling fetch collection seems to be empty",
.fetch() is async, see http://stackoverflow.com/questions/7259712/backbone-js-rest-collection-is-not-populated-after-fetch
http://stackoverflow.com/questions/8829729/backbone-js-collections-how-to-define-a-success-callback-for-fetch-recursive

## 19 agosto
- fixed test 1 and 2
- commented test loading in index.html

## 16 settembre
- modificato backend.js per tener conto dell'asincronicità della chiamata a fetch, aggiunto 
var that = this;
this.collection.on('reset', function() {
  console.log('going to call render');
  that.render();
});

## 17 settembre
- modificato router.js, aggiunto "this.navigate('index');" e tolto {pushState:true} perché su Chrome sembra non funzionare più il back button.

## 18 settembre
- creata nuova view listWork, elenca i lavori e li rende editabili (sostituisce workView)
- modificato template e stili admin

## 22 settembre
- installato nodemon (automatically restart node applications on file change)
- work out a work-around for input#displayFront[checked] not automatically changing its checked attribute. inserito .on() in backend.js:render e editWork.js:render per aggiornare lo stato del checkbox. modificato backend.js:102, editWork.js:57 e server.js

## 4-5 ottobre
- creato account su OpenShift e modificata l'app di conseguenza
- sistemato il file upload

## 6 ottobre
working on branch img-ajax to implement ajax upload of files. 
__IE__
as far as I could understand there are two main issues in uploading files using ajax on ie<10. infact it seems that neither IE is capable of handling  file upload using XmlHttpRequest nor it supports FormData.
two viable solutions:
1. make use of _jQuery Form Plugin_ having the form divided into three forms, see [here](http://stackoverflow.com/questions/2230150/alternative-to-an-ajax-upload-form-nested-in-another-form)
for the server side consider taking a look at [FineUploader](http://fineuploader.com/)
__REM__ [jQuery form plugin IE issues](https://github.com/malsup/form/issues/302). Since IE < 10 does not support ajax file uploads .. In the case where the server responds with a header content-type set to "application/json" that trigger's IE's default download behavior. To avoid this, do not set the content-type header to "application/json". Leave it as text/html or text/plain.
To maintain compatibility with the widest range of browsers this needs to be done through a [hidden iframe](http://stackoverflow.com/questions/8400488/how-to-submit-file-upload-form-with-ajax).
see also (this)[http://stackoverflow.com/questions/11506510/ajax-file-upload-form-submit-without-jquery-or-iframes]
__jquery.iframe-transport.js__
[This jQuery plugin](http://cmlenz.github.io/jquery-iframe-transport/) implements an <iframe> transport so that $.ajax() calls support the uploading of files using standard HTML file input fields. This is done by switching the exchange from XMLHttpRequest to a hidden iframe element containing a form that is submitted.
2. try using [jQuery File Upload Plugin](https://github.com/blueimp/jQuery-File-Upload/wiki/Basic-plugin)

## 24 ottobre
- on branch _login_ things work fine, merged and removed the branch.
- on branch _display-work_, modified router.js and frontend.js, merged and then removed the branch.
- merged branch _img-ajax_ into _master_
- __SOLVED__ selecting a work from the nav menu work-related images do not show > flexslider was not started in menuitem.js
- __FIXED__ admin>aggiungi un lavoro >> non viene salvato l'url dell'immagine nel db

## 26 ottobre
- created new branch _new-admin-ui_
- created new View app.AddEditWorkView e modificato backend.js e listWork.js

# 29 ottobre
on branch _new-admin-ui_
- fixes on app.AddEditWorkView e app.Backend.js
- inserito uploader file, vedi Sites/Lab/luke-uploader

# 30 ottobre
- on branch _new-admin-ui_ (vl v.2.0)
  - inserito uploader file, vedi Sites/Lab/luke-uploader, adesso funziona
- creato backup della v.1.*, 131030-bck-vl-1.9
- merged branch _new-admin-ui_
- creato branch _video_

# 31 ottobre
- on branch _video_
  - modificato AddEditTpl e inserito campo per video id 

# 3novembre
- merged branch _video_ into _master_
- created branch _sortable_, now works have an order that ca be modified using drag and drop
- merged branch _sortable_ into _master_
- created branch _vale_

# 5 novembre
- fixed login page
- fixed _spostare tecnica e data su due righe sotto al titolo_
- fixed _non funziona url della pagina se si accede da menu_
- aggiunta immagine _upload progress_
- fixed _navigation bar (a volte scompare da admin)_
- created branch _img-resize_, makes use of __easyimage__ to resize images on upload

# 6-7 novembre
- merged branch _img-resize_ into master, utilizzato modulo [easyimage](https://github.com/hacksparrow/node-easyimage)
- created branch _caption_, modificato schema db per le immagini, ref. [osmani](http://addyosmani.github.io/backbone-fundamentals/) oppure [stackoverflow](http://stackoverflow.com/questions/11917808/nested-object-schema-in-mongoose)

# 8 novembre
- fixed issue with edit button not properly opening/closing
- branch _caption_

# 9 novembre
- branch _caption_, 
- fixed _evitare il resize di immagini già ridimensionate_

# 18 novembre
- branch _caption_
- modificato flexslider.css:41 tolto width: 100% e modificato foglio di stile, le immagini hanno solo max-height: 396px, la larghezza scala con la dimensione della finestra
- messa a punto la copia e il cambio di struttura tra il database su openshift e il nuovo schema utilizzato in _caption_, vedi __convert-db.js__
- modificata la parte di resize, tolto watcher e imgInfo (la versione precedente è salvata come __server.js.watcher__), vedi appunti 18 novembre quaderno rosso.

# 21 novembre
- branch _caption_
- fixed mostrare la prima immagine mentre vengono caricate le altre, vedi [articolo](http://stackoverflow.com/questions/12717097/flexslider-slow-image-load)
- changes in menuItem.js e work.js: using $.Deferred to wait for images to be loaded

# 22 novembre
- branch _caption_
- fixed pages being loaded 2x when called from the menu, menuItem.js

# 27 novembre
- merged branch _caption_ into _master_
- created new branch _ie8_ and fixed ie8- behavior based on Twitter Bootstrap docs
- merged _ie8_ into _master_ 

# 2 dicembre
__the project has moved to a Sites/os/vl2__
as of 6 december frontend has been rewritten and part of the backend as well.

# 6 dicembre
- there is still some logic in frontend code to handle filters and menu's active state.
- _preview_ branch merged into master
- active branch is _master_

# 7 dicembre
- deleted branch _preview_
__the project has moved back to a Sites/os/vl__

# 23 dicembre
- minor changes
  -  preload only the first image
  -  admin now displays filename
  -  fixed admin media type is not updated
  -  fixed admin view works not using title_url
# 24 dicembre
- fixed non si può scrivere nel form su webkit, input.btn { -webkit-user-select: auto; }, vedi [stackoverflow](http://stackoverflow.com/questions/11679358/input-has-focus-but-cant-type-in-webkit)

# 5 gennaio
- on init the first work is displayed
- fixed #admin, click on cancel
- fixed aggiungere _role_ agli utenti per accesso preview ma non admin

# TODO
- wrong login error message
- images upload: avoid duplicating ajax calls upon multiple clicks
- bootstrap _tooltip_
- responsive, media-queries
- quando si aggiorna un lavoro non viene fatto il refresh della collection in frontendview
- caption come campo textarea
- sito bilingue?
- autenticazione su accesso a pagina (le sessioni funzionano?)
- [domain name](https://www.openshift.com/faq/i-have-deployed-my-app-but-i-don%E2%80%99t-like-telling-people-to-visit-myapp-myusernamerhcloudcom-how-c) 
- rimuovere pagine statiche