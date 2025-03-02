local isLoadingScreenActive = true

RegisterNUICallback('loadingScreenFinished', function(data, cb)
    isLoadingScreenActive = false
    ShutdownLoadingScreen()
    ShutdownLoadingScreenNui()
    cb('ok')
end)

CreateThread(function()
    local timeout = 30000
    local start = GetGameTimer()
    
    while isLoadingScreenActive do
        Citizen.Wait(500)
        
        if GetGameTimer() - start > timeout then
            isLoadingScreenActive = false
            ShutdownLoadingScreen()
            ShutdownLoadingScreenNui()
            break
        end
    end
end)