
import dgsr from '../../../resources/images/logo_dgsr.png'
export default function AppLogoIcon() {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl   p-2 shadow-sm">
            <img src={`${dgsr}`} alt="Logo dgsr" className="h-10 w-10 object-contain" />
        </div>
    );
}
