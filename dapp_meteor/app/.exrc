if &cp | set nocp | endif
let s:cpo_save=&cpo
set cpo&vim
imap <silent> <Plug>IMAP_JumpBack =IMAP_Jumpfunc('b', 0)
imap <silent> <Plug>IMAP_JumpForward =IMAP_Jumpfunc('', 0)
map! <D-v> *
vmap <NL> <Plug>IMAP_JumpForward
nmap <NL> <Plug>IMAP_JumpForward
vmap gx <Plug>NetrwBrowseXVis
nmap gx <Plug>NetrwBrowseX
vnoremap <silent> <Plug>NetrwBrowseXVis :call netrw#BrowseXVis()
nnoremap <silent> <Plug>NetrwBrowseX :call netrw#BrowseX(expand((exists("g:netrw_gx")? g:netrw_gx : '<cfile>')),netrw#CheckIfRemote())
vmap <silent> <Plug>IMAP_JumpBack `<i=IMAP_Jumpfunc('b', 0)
vmap <silent> <Plug>IMAP_JumpForward i=IMAP_Jumpfunc('', 0)
vmap <silent> <Plug>IMAP_DeleteAndJumpBack "_<Del>i=IMAP_Jumpfunc('b', 0)
vmap <silent> <Plug>IMAP_DeleteAndJumpForward "_<Del>i=IMAP_Jumpfunc('', 0)
nmap <silent> <Plug>IMAP_JumpBack i=IMAP_Jumpfunc('b', 0)
nmap <silent> <Plug>IMAP_JumpForward i=IMAP_Jumpfunc('', 0)
nmap <F8> :TagbarToggle
vmap <BS> "-d
vmap <D-x> "*d
vmap <D-c> "*y
vmap <D-v> "-d"*P
nmap <D-v> "*P
imap <NL> <Plug>IMAP_JumpForward
cnoremap sudow w !sudo tee % >/dev/null
let &cpo=s:cpo_save
unlet s:cpo_save
set autoindent
set background=dark
set backspace=indent,eol,start
set clipboard=unnamed
set directory=~/.vim/swapfiles//
set expandtab
set fileencodings=ucs-bom,utf-8,default,latin1
set grepprg=grep\ -nH\ $*
set helplang=en
set hlsearch
set ignorecase
set incsearch
set mouse=a
set ruler
set runtimepath=~/.vim,~/.vim/bundle/vundle,~/.vim/bundle/tagbar,~/.vim/bundle/molokai,~/.vim/bundle/fuzzy-finder,~/.vim/bundle/syntastic,~/.vim/bundle/vim-jade,~/.vim/bundle/vim-less,~/.vim/bundle/vim-coffee-script,~/.vim/bundle/taglist.vim,~/.vim/bundle/vim-latex,~/.vim/bundle/vim-stylus,~/.vim/bundle/nerdtree,/usr/local/share/vim/vimfiles,/usr/local/share/vim/vim74,/usr/local/share/vim/vimfiles/after,~/.vim/after,~/.vim/bundle/Vundle.vim,~/.vim/bundle/vundle/after,~/.vim/bundle/tagbar/after,~/.vim/bundle/molokai/after,~/.vim/bundle/fuzzy-finder/after,~/.vim/bundle/syntastic/after,~/.vim/bundle/vim-jade/after,~/.vim/bundle/vim-less/after,~/.vim/bundle/vim-coffee-script/after,~/.vim/bundle/taglist.vim/after,~/.vim/bundle/vim-latex/after,~/.vim/bundle/vim-stylus/after,~/.vim/bundle/nerdtree/after
set scrolloff=5
set shiftwidth=2
set smartindent
set smarttab
set softtabstop=2
set tabstop=2
" vim: set ft=vim :
