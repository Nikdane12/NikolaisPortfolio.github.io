Function IsAdmin {
    $user = [Security.Principal.WindowsIdentity]::GetCurrent();
    (New-Object Security.Principal.WindowsPrincipal $user).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator) 
}

If (IsAdmin) {
    Exit 0
}
Else{ 
    Write-Warning "Install as windows service requires admin rights. Run-as-Admin on your shell and try again."
    Exit 1
}