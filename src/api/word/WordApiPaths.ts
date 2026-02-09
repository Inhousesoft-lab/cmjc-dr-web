/**
 * 대국민포털_단어기본 정보 목록 조회 
 */
export const selectWordListApiPath = () => '/word/selectWordList'

/**
 * 대국민포털_단어기본 정보 조회 
 */
export const getWordApiPath = () => '/word/getWord'

/**
 * 대국민포털_단어기본 정보 입력 
 */
export const insertWordApiPath = () => '/word/insertWord'

/**
 * 대국민포털_단어기본 정보 수정 
 */
export const updateWordApiPath = () => '/word/updateWord'

/**
 * 대국민포털_단어기본 정보 저장 
 * 기존 데이터가 존재하지 않으면 입력하고, 존재하면 수정한다.
 */
export const saveWordApiPath = () => '/word/saveWord'

/**
 * 대국민포털_단어기본 정보 삭제 
 */
export const deleteWordApiPath = () => '/word/deleteWord'
