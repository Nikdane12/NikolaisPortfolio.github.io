Function HasJava {
    try { 
        Get-Command java -ErrorAction stop 
        $TRUE
    }
    catch { 
        $FALSE
    }
}

If (HasJava) {
    Exit 0
}
Else{ 
    Write-Warning "Java was not detected, and any calls to functions requiring Java (like sybase) will KILL THIS APP if they are run."
    Exit 1
}