type stateType = {
    key: string,
    file: string
    data: any
}
type updateStateType = (key: string, file: string, data: any) => void
type updateDataKeyType = (key: string, data: any) => void
export type dataToProcessedType = () => stateType[]
export type onWaitProcessingType = () => number
const createWaitState = (): { waitToProcess: onWaitProcessingType, dataProccess: dataToProcessedType, updateState: updateStateType, updateDataKey: updateDataKeyType } => {
    let state: stateType[] = []
    let maxProcesState = 50

    const updateState = (key: string, file: string, data: any) => {
        state.push({ key, file, data })
    }
    const dataProccess = () => {
        const getMax = state.filter((_, index) => (index + 1) <= maxProcesState)
        state = state.filter((_, index) => (index + 1) > maxProcesState)

        return getMax
    }

    const waitToProcess = () => state.length

    const updateDataKey = (key:string, data: any) => {
        const index  = state.findIndex((it)=> it.key === key)
        if (index >= 0) state[index].data = data
    }


    return { updateState, dataProccess, waitToProcess, updateDataKey }
}

export const {updateState, dataProccess, waitToProcess, updateDataKey} = createWaitState();